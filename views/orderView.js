const order = require('../models/Order');

module.exports = (data) => {
    const captcha = order.generate();
    return `${(data.errors.length > 0) ? 
         `<div class='errors'>
          <p>ERRORS:</p>
            ${data.errors.map( v => `<p>${v}</p>`)}
         </div>`.replace(/[, ]+/g, ' ') : ''
}
${data.good ? `<div class="errors no_errors">
<p>Order Completed Successfully! Thank you!</p>
</div>
<script>localStorage.removeItem('basket')</script>
${
    data.name='', data.address = '', data.email='', data.good=''
}`  : ''}
    <div class="wrapp_order">
    <div class="robo_order"></div>
    <form method="post" id="order">
        <input name="name" type="text" placeholder="__FULL NAME__" value="${data.name ? data.name : ''}">
        <input name="address" type="text" placeholder="__ADDRESS__" value="${data.address ? data.address.replace(/[+ ]+/g, ' ') : ''}">
        <input name="email" type="text" placeholder="__EMAIL__" value="${data.email ? data.email : ''}">
        <p>CAPTCHA</p>
        <div class="captcha" style="background: url(../img/captcha/${captcha}) no-repeat center center;background-size:contain;"></div>
        <input name="captcha" type="text" placeholder="ROBOT OR HUMAN ? ">
        <input name="captchaImg" type="hidden" value='${captcha}'>
        <input name='ids' type="hidden" value=''>
        <input type="hidden" name="csrf" value="">
        <label for="check_order" class="check_order">ORDER<input id="check_order" name="check_order" type="submit"></label>
    </form>
</div>
<script>
if(localStorage.getItem("basket"))
{
 let ids = JSON.parse(localStorage.getItem("basket"));
 let string = JSON.stringify(Object.keys(ids).map((v) => v + ',' + ids[v]['qty']));
 document.querySelector('input[name=ids').value=string;   
}   
</script>
`; 
}