//variables
const url = "https://sandbox.iexapis.com/stable/stock/";
let ticker = "";
const token = "/quote?token=Tsk_678b4f8a0c3b4032b11c7568fb24dc17";
let color = "";
let icon = "";
let sign = "";

//Format number function
function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    let item = lookup.slice().reverse().find(function(item) {
      return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }
  

$("#search-stock-button").click(function () {
    //grab user value
    ticker = $('#search-name').val();

    $.get((url + ticker + token), function (data) {
        //Conditionally set colors, icons, and signs
        if (data.change > 0) {
            color = "green";
            icon = "fa-arrow-up";
            sign = "+";
        } else if (data.change < 0) {
            color = "red";
            icon = "fa-arrow-down";
            sign = "";
        } else {
            color = "";
            icon = "";
            sign = "";
        }

        //shorten market cap and volume into an easy to look at number
        let marketCapShortened = nFormatter(data.marketCap, 2);
        let avgVolumeShortened = nFormatter(data.avgTotalVolume, 2);
        let absolutePercentChange = Math.abs((data.changePercent.toFixed(2)));

        //Overwrite HTML with card for latest ticker
        $(".stock-data").html(`
        <div class="stock-data-card">
            <div class="stock-data-card-header">
                <div class="stock-data-card-header-title">
                    ${data.symbol}
                </div>
                <div class="stock-data-card-header-title">
                    ${data.latestPrice}
                </div>
            </div>
            <div class="stock-data-card-header-sub">
                <div class="stock-data-card-sub-title">
                    ${data.companyName}
                </div>
                <div class="stock-data-card-price ${color}">
                    ${sign}${data.change} (${absolutePercentChange}%) <i class="fas ${icon}"></i>
                </div>
            </div>
            <div class="stock-data-card-main">
                <div class="stock-data-card-main-half">
                    <div class="stock-data-card-main-half-values">
                        <div class="stock-data-card-main-half-values-name">Mkt Cap</div>
                        <div class="stock-data-card-main-half-values-number">${marketCapShortened}</div>
                    </div>
                    <div class="stock-data-card-main-half-values">
                        <div class="stock-data-card-main-half-values-name">P/E ratio</div>
                        <div class="stock-data-card-main-half-values-number">${data.peRatio}</div>
                    </div>
                    <div class="stock-data-card-main-half-values">
                        <div class="stock-data-card-main-half-values-name">Avg. volume</div>
                        <div class="stock-data-card-main-half-values-number">${avgVolumeShortened}</div>
                    </div>
                </div>
                <div class="stock-data-card-main-half">
                    <div class="stock-data-card-main-half-values">
                        <div class="stock-data-card-main-half-values-name">Prev Close</div>
                        <div class="stock-data-card-main-half-values-number">${data.previousClose}</div>
                    </div>
                    <div class="stock-data-card-main-half-values">
                        <div class="stock-data-card-main-half-values-name">52-wk high</div>
                        <div class="stock-data-card-main-half-values-number">${data.week52High}</div>
                    </div>
                    <div class="stock-data-card-main-half-values">
                        <div class="stock-data-card-main-half-values-name">52-wk low</div>
                        <div class="stock-data-card-main-half-values-number">${data.week52Low}</div>
                    </div>
                </div>
            </div>
        </div>
        `);
    }).fail(function () {
        //Overwrite HTML with card for invalid tickers
        $(".stock-data").html(`
            <div class="stock-data-placeholder">Invalid ticker symbol.</div>
        `);
    });;
});