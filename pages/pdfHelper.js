import { renderToStaticMarkup, renderToString } from 'react-dom/server'
import puppeteer from 'puppeteer'

export const putPdfToResponse = async (res, html, sheet, query) => {
    const css = sheet
        .getStyleElement()
        .map((e) => e.props.dangerouslySetInnerHTML.__html)
        .join()
    const bpRefNo = 15
    const buffer = await componentToPDFBuffer(
        <html
            lang="en"
            dangerouslySetInnerHTML={{
                __html: `
              <head><style>${renderToString(css)}</style></head>
              <body>
              <div id="__next">
              <div class="my">${html}</div>
              </div>
              </body>
              `,
            }}
        />,
        bpRefNo,
    ).catch(err => {
        throw new Error(err)
    })
    res.setHeader('Content-disposition', `attachment; filename="${bpRefNo}.pdf"`)
    res.setHeader('Content-Type', 'application/pdf')
    res.end(buffer)
}

export const componentToPDFBuffer = async (component, bpRefNo) => {
    const html = renderToStaticMarkup(component)
    const browser = await puppeteer.launch({
        headless: true,
        args: ['—no-sandbox', '—disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })

    const pdf = await page.pdf({
        format: 'A4',
        scale: 0.5,
        printBackground: true,
        margin: {
            top: '20px',
            bottom: '70px',
            left: '0',
            right: '0',
        },
        displayHeaderFooter: true,
        headerTemplate: '',
    })
    await browser.close()
    return pdf
}