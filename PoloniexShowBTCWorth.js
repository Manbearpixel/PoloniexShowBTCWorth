(function(){

  if (window.__superAwesomeThingy == true) {
    console.warn('-- SuperAwesomeThingy BTC shower is already active!');
    console.info('-- Disabling SuperAwesomeThingy BTC shower!');
    clearInterval(window.__superAwesomeThingID);
    window.__superAwesomeThingID = null;
    window.__superAwesomeThingy = false;
    return false;
  }
  else {
    window.__superAwesomeThingy = true;


    var runSwitch = function(currentBTC) {
      console.info('-- adjusting BTC value --');

      // Loop through each tablerow (tr) and adjust BTC value
      jQuery('#marketBTC > tbody  > tr').each(function(){
        var currentRow = jQuery(this);
        var currentPriceCol = currentRow.find('.price');

        // Check if we have already manipulated this row...
        if (currentPriceCol.text().indexOf(';;') != -1) {
          var splitter = currentPriceCol.text().split(';;');
          var parsedPrice = parseFloat(splitter[0]).toFixed(8);
        }
        else {
          var parsedPrice = parseFloat(currentPriceCol.text()).toFixed(8);
        }

        var calculatedBTC = (parsedPrice * currentBTC).toFixed(8);
        var newPriceText = parsedPrice + ';;\n($'+ calculatedBTC +' btc)';

        currentPriceCol.text(newPriceText);
        return true;
      });
    };

    var fetchBTCOrder = function() {
      // Make XHR GET request to polo trade history for USD/BTC
      jQuery.get('https://public.poloniex.com/?command=returnTradeHistory&currencyPair=USDT_BTC', function(r){ 
        var recentOrders = r;
        var recentBuy = recentOrders[100]; // Grab most recent BTC BUY order
        var currentBTCRate = parseFloat(recentBuy.rate).toFixed(2); 

        // shove that rate to all current BTC rows
        runSwitch(currentBTCRate);
      });
    };

    // Fetch every 10 seconds (1000 milliseconds per 1 second)
    // Best to keep this low, don't need to make too many calls
    // Save the ID to cancel calls if it is necessary
    fetchBTCOrder();
    window.__superAwesomeThingID = setInterval(fetchBTCOrder, 1000 * 10);

    console.info('-- Poloniex BTC price shower-thingy by Polo User @PkMnRed --');
  }
})();
