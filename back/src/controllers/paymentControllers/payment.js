const { Order, Order_Product, Product, User } = require("../../db");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
      user:'sportgymfitness198@gmail.com',
      pass:'botlgntwqdomgxqo'
  },
});

// const { TOKEN } = process.env;
const mercadopago = require("mercadopago");

mercadopago.configure({
    access_token: 'TEST-6526025757594263-072114-48b8fe283514f9ea144ed66ecc48f689-794718240'

});
const mensaje = ''
let mail = async (userMail,firstName, lastName) => {
    await transporter.sendMail({
        from: '"Sportgym" <foo@example.com>', // sender address
        to: userMail, // list of receivers
        subject: `Compra Exitosa ${firstName ? firstName : ""} ✔`, // Subject line
        text: `Hola ${firstName && lastName ? `${firstName, lastName}`: "!"}`, // plain text body
        html: `<b>Hola ${firstName && lastName ? `${firstName, lastName}`: ""}, excelente compra, te avisaremos cuando se despache la entrega, para  cualquier consulta relacionada o no con tu pedido, te puedes responder este correo electrónico o escribirnos por sportgymfitness198@gmail.com. Atentamente sportGym, tu sucursal, de la salud física. </b>`, // html body
    });
}

//mercadopago/pagos
async function payment(req, res, next) {
    console.log('FUNCION PAYMEEEENT')
    const {
        payment_id,         //1239191891
        status,             //approved
        external_reference, //faac272e-a92d-4a15-a472-c9363559aa00
        //El resto no lo estamos usando
        collection_id,      //1239191891
        payment_type,       //credit_card
        collection_status,  //approved
        merchant_order_id,  //3014520874
        preference_id,      //794718240-10459525-b2bf-4bba-b3fb-fae0b736861a
        site_id,            //MLA
        processing_mode,    //aggregator
        merchant_account_id,//null
} = req.query;
//Obtenemmos el mail del user
// const orderm = await Order.findByPk('cc64ab40-bd46-4b02-9cac-277301c294d8',
const orderm = await Order.findByPk(external_reference,
    {include: [
        {
            model: User,
            attributes: ["email", "firstName", "lastName"]
        }]}
        );
        console.log('orderm.user.email',orderm)
        await mail(orderm.user.email, orderm.user.firstName, orderm.user.lastName);
    Order.findByPk(external_reference)
        .then(order => {
            order.payment_id = payment_id;
            order.paymentState = status
            order.orderState = 'COMPLETED'
            order.save()
                .then(() => {
                    console.info('redict sucess')
                    
                    return res.redirect('http://localhost:3000')
                })
                .catch(erro => {
                    return res.redirect(`http://localhost:3000/?error=${error}&where=al+salvar`)
                })
        })
        .catch(error => {
            return res.redirect(`http://localhost:3000/error=${error}&where=al+buscar`)
        })

}
//mercadopago/pagos

async function pagosId(req, res) {
    console.log('pagosId access_token,', PROD_ACCESS_TOKEN)
    // const mp = new mercadopago(access_token)
    const mp = new mercadopago(PROD_ACCESS_TOKEN)
    const id = req.params.id
    console.info("Buscando el id", id)
    mp.get(`/v1/payments/search`, { 'status': 'pending' })//{"external_reference":id})
        .then(resultado => {
            console.info('resultado', resultado)
            res.json({ "resultado": resultado })
        })
        .catch(err => {
            console.error('No se consulto:', err)
            res.json({
                error: err
            })
        })

}
/*
4509 9535 6623 3704
11/25
123

American de prueba
371180303257522
11/25
1234

Secuencia despues pagar y volver al sitio
GET /mercadopago/pagos
collection_id          = 1239191891
collection_status      = approved
payment_id             = 1239191891
status                 = approved
external_reference     = faac272e-a92d-4a15-a472-c9363559aa00
payment_type           = credit_card
merchant_order_id      = 3014520874
preference_id          = 794718240-10459525-b2bf-4bba-b3fb-fae0b736861a
site_id                = MLA
processing_mode        = aggregator
merchant_account_id    = null

*/


module.exports = {
    payment,
    pagosId
}