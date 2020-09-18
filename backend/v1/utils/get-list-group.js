exports.getListGroup = async function(page, selector) {
    await page.waitForSelector(selector);
    return await page.evaluate(() => {
        const data = $(selector).find(".list-group-item").map((i, row) => {
            return {
                title: $(row).find(">b").text(),
                content: $(row).find(">.comment").text(),
                date: $(row).find(">small").text()
            }
        });

        return data.get();
    });
}