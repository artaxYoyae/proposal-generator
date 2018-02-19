function TXListener(provider, prefix, transaction) {

    this.provider = provider;
    this.prefix = prefix;
    this.transaction = transaction;

    this.blockheight = null;
    this.confirmations = null;

}

function sleep10secs() {
  return new Promise(resolve => {
    setTimeout(() => {}, 10000);
  });
}



TXListener.prototype.initSocket = function(cb) {
    var self = this;
    var currentConfirmations = 0;

	async function callGetBlock() {
	    while ( currentConfirmations < 6 )
		{
			console.log('getblock: '+ data);

			self.getBlock(data, function(err, res) {
				if (err) console.log("error fetching block: " + data);
				self.confirmations = res.height - self.blockheight;
				if(self.confirmations >= 0)
				{
					console.log('There is '+ self.confirmations + ' new blocks.');
					currentConfirmations += self.confirmations;
					$("#progressbar").progressbar({value: ((100 / 6) * currentConfirmations)});
					console.log('confirmations: ' + currentConfirmations);
					self.blockheight = res.height;
				}
			});
			
			await sleep10secs();
		}
		
		cb();
	}

	
	

};

TXListener.prototype.getTx = function(cb) {
    var txid = this.transaction;

    var opts = {
        type: "GET",
        route: "/getrawtransaction?txid="+txid,
        data: {
            format: "json"
        }
    };

    this._fetch(opts, cb);
};

TXListener.prototype.getBlock = function(hash, cb) {

    var opts = {
        type: "GET",
        route: "/getblock?hash="+hash,
        data: {
            format: "json"
        }
    };

    this._fetch(opts, cb);
};

TXListener.prototype._fetch = function(opts,cb) {
    var self = this;
    var provider = opts.provider || self.provider;
    var prefix = opts.prefix || self.prefix;

    if(opts.type && opts.route && opts.data) {

        jQuery.ajax({
            type: opts.type,
            url: "https://cors-anywhere.herokuapp.com/" + provider + prefix + opts.route,
            data: JSON.stringify(opts.data),
            contentType: "application/json; charset=utf-8",
            crossDomain: true,
            dataType: "json",
            success: function (data, status, jqXHR) {
                cb(null, data);
            },
            error: function (jqXHR, status, error) {
                var err = jqXHR.status;
                //var err = eval("(" + jqXHR.responseText + ")");
                cb(err, null);
            }
        });

    } else {
        cb('missing parameter',null);
    }
};
