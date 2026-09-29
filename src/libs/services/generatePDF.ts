import puppeteer from "puppeteer";
import { UserType } from "../mongoose/models/user.model";
import { InvoiceType } from "../mongoose/models/invoice.model";
import { ScheduleType } from "../mongoose/models/schedule.model";


export const generateInvoicePDF = async (user: UserType, invoice: InvoiceType<ScheduleType>) => {
    const browser = await puppeteer.launch({
        headless: true
    })

    try {
        const page = await browser.newPage()
        const HTML = `
            <!DOCTYPE html>
                <html>
                    <head>
                    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
                    <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                    />
                    <style>
                    @page {
                        size: A4;
                        margin: 0;
                    }
                    :root {
                        --red: #eb2626;
                    }
                    * {
                        box-sizing: border-box;
                        margin: 0;
                    }

                    body {
                        font-family: "Poppins", Sans-Serif;
                        padding: 16px;
                    }

                    .table-wrapper {
                        border-top-left-radius: 12px;
                        border-top-right-radius: 12px;
                        border-bottom-right-radius: 12px;
                        overflow: hidden;
                    }

                    table tfoot {
                        font-weight: 700;
                    }

                    table .footer-desc {
                        text-align: left;
                    }

                    table .td-foot {
                        border-width: 1px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        border-color: #CECECE;
                        font-size: 14px;
                    }

                    table .row-desc {
                        flex: 1;
                        text-align: left;
                        width: 40%;
                        padding: 0 4px;
                    }

                    table thead {
                        background-color: var(--red);
                        color: #FFF;
                    }

                    table th {
                        border: 1px solid #FFF;
                    }

                    table td {
                        padding: 8px;
                        text-align: right;
                        border: 1px solid #CECECE;
                    }

                    table tfoot td {
                        border-width: 0;
                    }

                    .card {
                        border: 1px solid #DEDEDE;
                        border-radius: 12px;
                        padding: 8px;
                        margin: 16px 0;
                    }

                    .invoice-title-wrapper {
                        width: 100%;
                        flex: 1;
                        align-items: flex-start;

                    }
                    .invoice-title-line {
                        height: 8px;
                        width: 60px;
                        background-color: #d1060d;
                    }

                    .invoice-title {
                        font-size: 32px;
                    }

                    .contact {
                        font-size: 14px;
                        display: flex;
                        gap: 10px;
                        background-color: #eb2626;
                        padding: 4px;
                        color: #FFF;
                    }

                    .contact div {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                    }

                    .contact svg {
                        width: 16px;
                        height: 16px;
                        fill: #FFF;
                    }

                    svg {
                        width: 32px;
                        height: 32px;
                        fill: #868786;
                    }

                    .icon-wrapper {
                        background-color: #EAEAEA;
                        padding: 8px;
                        border-radius: 8px;
                        height: fit-content;
                        display: flex;
                        align-items: center;
                    }

                    .invoice-detail {
                        display: grid;
                        grid-template-columns: auto auto;
                        gap: 16px
                    }
                    .detail {
                        display: flex;
                        align-items: center;
                        gap: 10px
                    }

                    .invoice-footer {
                        display: flex;
                        gap: 10px
                    }
                    </style>
                </head>
                <body>
                    <header>
                        <div class="invoice-title-wrapper">
                            <div class="invoice-title-line">
                            </div>
                            <h1 class="invoice-title">INVOICE</h1>
                        </div>
                        <div class="contact">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                <path d="M351.9 280l-190.9 0c2.9 64.5 17.2 123.9 37.5 167.4 11.4 24.5 23.7 41.8 35.1 52.4 11.2 10.5 18.9 12.2 22.9 12.2s11.7-1.7 22.9-12.2c11.4-10.6 23.7-28 35.1-52.4 20.3-43.5 34.6-102.9 37.5-167.4zM160.9 232l190.9 0C349 167.5 334.7 108.1 314.4 64.6 303 40.2 290.7 22.8 279.3 12.2 268.1 1.7 260.4 0 256.4 0s-11.7 1.7-22.9 12.2c-11.4 10.6-23.7 28-35.1 52.4-20.3 43.5-34.6 102.9-37.5 167.4zm-48 0C116.4 146.4 138.5 66.9 170.8 14.7 78.7 47.3 10.9 131.2 1.5 232l111.4 0zM1.5 280c9.4 100.8 77.2 184.7 169.3 217.3-32.3-52.2-54.4-131.7-57.9-217.3L1.5 280zm398.4 0c-3.5 85.6-25.6 165.1-57.9 217.3 92.1-32.7 159.9-116.5 169.3-217.3l-111.4 0zm111.4-48C501.9 131.2 434.1 47.3 342 14.7 374.3 66.9 396.4 146.4 399.9 232l111.4 0z"/>
                            </svg>
                            www.japanitip.id
                        </div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                                <path d="M224.3 141a115 115 0 1 0 -.6 230 115 115 0 1 0 .6-230zm-.6 40.4a74.6 74.6 0 1 1 .6 149.2 74.6 74.6 0 1 1 -.6-149.2zm93.4-45.1a26.8 26.8 0 1 1 53.6 0 26.8 26.8 0 1 1 -53.6 0zm129.7 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM399 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
                                </svg>
                            japanitip.id
                        </div>
                        
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->
                                <path d="M380.9 97.1c-41.9-42-97.7-65.1-157-65.1-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480 117.7 449.1c32.4 17.7 68.9 27 106.1 27l.1 0c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3 18.6-68.1-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1s56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zM325.1 300.5c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 18-17.6 21.8c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7s-12.5-30.1-17.1-41.2c-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2s-9.7 1.4-14.8 6.9c-5.1 5.6-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4s4.6-24.1 3.2-26.4c-1.3-2.5-5-3.9-10.5-6.6z"/>
                                </svg>
                            +62 821-1546-9622
                        </div>
                        </div>
                    </header>
                    <h3>Rincian Invoice</h3>
                    <section class="card invoice-detail">
                        <div class="detail">
                            <div class="icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M144 128a80 80 0 1 1 160 0 80 80 0 1 1 -160 0zm208 0a128 128 0 1 0 -256 0 128 128 0 1 0 256 0zM48 480c0-70.7 57.3-128 128-128l96 0c70.7 0 128 57.3 128 128l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8c0-97.2-78.8-176-176-176l-96 0C78.8 304 0 382.8 0 480l0 8c0 13.3 10.7 24 24 24s24-10.7 24-24l0-8z"/></svg>                    
                            </div>
                            <div>
                                <h3>Nama pelanggan</h3>
                                <div style="text-transform: capitalize">
                                    ${invoice.customer}
                                </div>
                            </div>
                        </div>
                        <div class="detail">
                            <div class="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M120 0c13.3 0 24 10.7 24 24l0 40 160 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-40c0-13.3 10.7-24 24-24zM384 432c8.8 0 16-7.2 16-16l0-64-88 0 0 80 72 0zm16-128l0-80-88 0 0 80 88 0zm-136 0l0-80-80 0 0 80 80 0zm-128 0l0-80-88 0 0 80 88 0zM48 352l0 64c0 8.8 7.2 16 16 16l72 0 0-80-88 0zm136 0l0 80 80 0 0-80-80 0zM120 112l-56 0c-8.8 0-16 7.2-16 16l0 48 352 0 0-48c0-8.8-7.2-16-16-16l-264 0z"/></svg>                    
                            </div>
                            <div>
                                <h3>Batch</h3>
                                <div>
                                    ${new Date(invoice.batch.date).toLocaleDateString()}, ${invoice.batch.depart.country} - ${invoice.batch.arrival.country}
                                </div>
                            </div>
                        </div>
                        <div class="detail">
                            <div class="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M74.9 46.7c-9.6-14.9-29.4-19.2-44.2-9.6S11.5 66.4 21.1 81.3L143.7 272 88 272c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 0 32-72 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l72 0 0 48c0 17.7 14.3 32 32 32s32-14.3 32-32l0-48 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-72 0 0-32 72 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-55.7 0 122.6-190.7c9.6-14.9 5.3-34.7-9.6-44.2s-34.7-5.3-44.2 9.6L192 228.8 74.9 46.7z"/></svg>                    
                            </div>
                            <div>
                                <h3>Mata uang</h3>
                                <div>
                                    ${invoice.currency?.toUpperCase()}
                                </div>
                            </div>
                        </div>
                        <div class="detail">
                            <div class="icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M384 160c-17.7 0-32-14.3-32-32s14.3-32 32-32l160 0c17.7 0 32 14.3 32 32l0 160c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-82.7-169.4 169.4c-12.5 12.5-32.8 12.5-45.3 0L192 269.3 54.6 406.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l160-160c12.5-12.5 32.8-12.5 45.3 0L320 306.7 466.7 160 384 160z"/></svg>                </div>
                            <div>
                                <h3>Rate</h3>
                                <div>
                                    Rp ${invoice.rate}/JPY
                                </div>
                            </div>
                        </div>
                    </section>
                    <h3>Rincian Item</h3>
                    <section class="table-wrapper">
                        <table border="0">
                            <thead>
                                <tr>
                                    <th rowspan="2" class="row-desc">Deskripsi</th>
                                    <th rowspan="2">QTY</th>
                                    <th colspan="2">Harga</th>
                                    <th rowspan="2">Pajak</th>
                                    <th colspan="2">Total</th>
                                </tr>
                                <tr>
                                    <th class="currency">
                                        JPY
                                    </th>
                                    <th class="currency">
                                        IDR
                                    </th>
                                    <th class="currency">
                                        JPY
                                    </th>
                                    <th class="currency">
                                        IDR
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                ${invoice.items.map((i) => `
                                    <tr>
                                        <td class="row-desc">${i.name}</td>
                                        <td>${i.qty} ${i.unit}</td>
                                        <td>${i.price}</td>
                                        <td>${i.price}</td>
                                        <td>${i.tax}</td>
                                        <td>${i.subtotal}</td>
                                        <td>${i.subtotal}</td>
                                    </tr>
                                `)}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="footer-desc td-foot">Subtotal</td>
                                    <td class="td-foot"></td>
                                    <td class="td-foot"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="footer-desc td-foot">Deposit</td>
                                    <td class="td-foot"></td>
                                    <td class="td-foot"></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="footer-desc td-foot">Grand Total</td>
                                    <td class="td-foot"></td>
                                    <td class="td-foot"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </section>
                    <h3>Informasi Pembayaran</h3>
                    <section class="invoice-footer">
                        <table style="width: 100%">
                            <thead>
                                <tr>
                                    <th colspan="2">Budiono</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="row-desc">BCA</td>
                                    <td>089283484729920</td>
                                </tr>
                            </tbody>
                        </table>
                        <div style="width: 100%; text-align: center">
                            Terimakasih atas kepercayaan anda
                        </div>
                    </section>
                </body>
                </html>
            `
        
        await page.setContent(HTML, {
            waitUntil: "domcontentloaded"
        })

        const pdf = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "10mm",
                right: "10mm",
                bottom: "10mm",
                left: "10mm",
            }
        })

        return pdf
    } catch (error: unknown) {
        if(error instanceof Error) {
            console.error(error.message)
            
        }
    } finally {
        browser.close()
    }
}
