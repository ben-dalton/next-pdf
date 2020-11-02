import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import {putPdfToResponse} from './pdfHelper';

class MyDocument extends Document {
    static async getInitialProps({ req, res, query, renderPage }) {
        // Step 1: Create an instance of ServerStyleSheet
        const sheet = new ServerStyleSheet()
        // Step 2: Retrieve styles from components in the page
        const page = renderPage(App => props =>
            sheet.collectStyles(<App {...props} />),
        )

        // Step 3: Extract the styles as <style> tags
        const styleTags = sheet.getStyleElement()
        // Setup PDF if url contains ?pdf=true query parameter
        const server = !!req
        if (server && query.pdf === 'true') {
        // if (server && req.url === "/dashboard") {
            console.log(query)
            await putPdfToResponse(res, page.html, sheet, query)
            return
        }
        // Step 4: Pass styleTags as a prop
        return { ...page, renderPage, styleTags, server, query }
    }

    render() {
        return (
            <Html>
                <Head />
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument