const paypal = require("paypal-rest-sdk");
const router = require("express").Router();
const { ORIGIN, SUCCESS_MERCADOPAGO } = process.env;

paypal.configure({
    mode:"sandbox",
    client_id: "AXLu37FuQ0PhMkBFF9rM60_ac5w0J6TzcyCtKLZujgM9JcdzdYyrIWdbe0e1FAmfY0puVq6KtjS61DHg",
    client_secret: "EEmJrcGSghPO_7c05NybCHXT6neemGDi90Lg5st49gmKbBnSTDtyX0B8C1G264-unTk-5esuvaBMDmJu"
});



router.post("/", (req, res) => {
  
    let {prices, name, quantity, servicesId} = {...req.body}
    console.log('ESTOY EN BACK',req.body)

    let price = 0
    for (let i=0; i < prices.length; i++){
      price = price + prices[i]
    }
    
    // data.price = Math.round(data.price / 170)
    // data.price = prices

   

    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal"
        },
        redirect_urls: {
            return_url:`${SUCCESS_MERCADOPAGO}/users/purchase?servicesId=${servicesId}`,
            cancel_url: `${ORIGIN}/home`
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: name,
                            sku: "item",
                            price: price,
                            currency: "USD",
                            quantity: quantity,
                        }
                    ]
                },
                amount: {
                    currency: "USD",
                    total: price,
                },
                description: "This is the payment description."
            }
        ]
    };

    paypal.payment.create(create_payment_json, function(error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.json(payment.links[1].href);
        }
    });
});


router.get("/success", (req, res) => {
    // res.send("Success");
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: (quantity * price)
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render("success");
        }
    });
});

router.get("cancel", (req, res) => {
    res.send("cancel");
});


module.exports = router;