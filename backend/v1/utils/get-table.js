exports.getTable = async function(page, tableSelector) {
    await page.waitForSelector(tableSelector);
    return await page.evaluate((tableSelector) => {
        function getColumnsFromTable(selector) {
            let columns = {};
            function camelfy(txt) {
                return txt.trim().toLowerCase().replace(/[ ]/g, '_');
            }
            let currentI = 0;
            $(selector).find("thead > tr > th").each(function (i, colum) {
                const size = $(colum).prop("colSpan");

                Array.from(Array(size).keys()).forEach((times) => {
                    currentI = currentI + times;
                    columns[currentI] = camelfy($(colum).text());

                })

                currentI++;
            });
            return columns;
        }

        function getDataFromTable(selector) {
            let columns = getColumnsFromTable(selector);


            const data = $(selector).find("tbody > tr").map(function (i, row) {
                const rowData = {};

                $(row).find("td").each((iCell, cell) => {
                    const content = $(cell).text().trim();
                    const columName = columns[iCell];
                    if (columName in rowData) {
                        const previousContent = rowData[columName];
                        rowData[columName] = [].concat(previousContent).concat(content);
                    } else {
                        rowData[columName] = content;
                    }
                });

                return rowData;
            });

            return data.get();
        }

        return getDataFromTable(tableSelector);
    }, tableSelector);
}