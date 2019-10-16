
class Basket
{
    static nameClass()
    {
        //Basket.prototype.constructor.name.toLowerCase();
        let name = document.querySelector('.title_category_items');
        return name ? name.textContent.toLowerCase() : '';
    }

    static addBasket()
    {
        let addBasket = document.querySelectorAll('input[name=add_basket]');
        if(addBasket)
        {
            [...addBasket].forEach(el => {
                el.addEventListener('click', (e) => {
                    
                    e.preventDefault();
                    el.setAttribute("style", "background: url(../img/adding_basket_btn.png)");
                    let parent = el.parentElement.querySelector('input[name=id]') ?
                    el.parentElement : el.parentElement.parentElement;
                    let childrens = {
                        'id':parent.querySelector('input[name=id]').value,
                        'title':parent.querySelector('input[name=title]').value,
                        'price':parent.querySelector('input[name=price]').value,
                        'img': parent.querySelector('input[name=img]').value,
                        'url': parent.querySelector('input[name=url]').value,
                        'qty': parent.querySelector('input[name=qty]') ?
                               parent.querySelector('input[name=qty]').value :
                               document.querySelector('input[name=qty]').value
                    }
                    const arr = {};
                    const { id, price, title, img, url, qty } = childrens;
                    const item = { price, title, url, img, qty };
                    arr[id] = { ...item };
                
                    if (!localStorage.getItem("basket")) {
                      localStorage.setItem("basket", JSON.stringify(arr));
                      Basket.countBasket();
                    } else {
                        let parse = JSON.parse(localStorage.getItem("basket"));
                        delete parse[id];
                        localStorage.setItem("basket", JSON.stringify({ ...arr, ...parse }));
                        Basket.countBasket();
                };
            });
        });
    }
}

    static addWishList()
    {
        let addBasket = document.querySelectorAll('input[name=add_wish]');
        if(addBasket)
        {
            [...addBasket].forEach(el => {
                el.addEventListener('click', (e) => {
                    e.preventDefault();
                    el.setAttribute("style", "background: url(../img/adding_wish_btn.png)");
                    let parent = el.parentElement.querySelector('input[name=id]') ?
                    el.parentElement : el.parentElement.parentElement;
                    let childrens = {
                        'id':parent.querySelector('input[name=id]').value,
                        'title':parent.querySelector('input[name=title]').value,
                        'price':parent.querySelector('input[name=price]').value,
                        'img': parent.querySelector('input[name=img]').value,
                        'url': parent.querySelector('input[name=url]').value,
                        'qty': parent.querySelector('input[name=qty]') ?
                        parent.querySelector('input[name=qty]').value :
                        document.querySelector('input[name=qty]').value
                    }
                    const arr = {};
                    const { id, price, title, img, url, qty } = childrens;
                    const item = { price, title, url, img, qty };
                    arr[id] = { ...item };
                
                    if (!localStorage.getItem("wishlist")) {
                    localStorage.setItem("wishlist", JSON.stringify(arr));
                    Basket.countWishList();
                    } else {
                        let parse = JSON.parse(localStorage.getItem("wishlist"));
                        delete parse[id];
                        localStorage.setItem("wishlist", JSON.stringify({ ...arr, ...parse }));
                        Basket.countWishList();
                };
            });
        });
    }
    }

    static countBasket()
    {
        let count = localStorage.getItem("basket") ? Object.keys(JSON.parse(localStorage.getItem("basket"))).length : 0;
        document.querySelector('.nav_up > ul li:nth-child(3) > a > span ~ span').textContent=count;
        document.querySelector('.mobile_nav > ul li:nth-child(3) > a > span ~ span').textContent=count;
    }

    static countWishList()
    {
        let count = localStorage.getItem("wishlist") ? Object.keys(JSON.parse(localStorage.getItem("wishlist"))).length : 0;
        document.querySelector('.nav_up > ul li:nth-child(2) > a > span ~ span').textContent=count;
        document.querySelector('.mobile_nav > ul li:nth-child(2) > a > span ~ span').textContent=count;
    }

    static btnBasketBg()
    {
        if(localStorage.getItem("basket"))
        {
        [...document.querySelectorAll('input[name="add_basket"]')].forEach( (v) => {
            if(v.parentElement.localName !== 'label'){
               if(Object.keys(JSON.parse(localStorage.getItem("basket")))
               .includes(String(v.parentElement.querySelector('input[name=id]').value)))
                {
                   v.setAttribute("style", "background: url(../img/adding_basket_btn.png)") 
                }  
            }

        })}
    }

    static btnWishListBg()
    {
        if(localStorage.getItem("wishlist"))
        {
        [...document.querySelectorAll('input[name="add_wish"]')].forEach( (v) => {
            if(v.parentElement.localName !== 'label'){
              if(Object.keys(JSON.parse(localStorage.getItem("wishlist")))
               .includes(String(v.parentElement.querySelector('input[name=id]').value)))
                {
                   v.setAttribute("style", "background: url(../img/adding_wish_btn.png)") 
                }  
            }
        })
        }

    }

    static showBasketItem()
    {
       let items = localStorage.getItem(Basket.nameClass()) ? JSON.parse(localStorage.getItem(Basket.nameClass())) : null;
       let wrapp = document.querySelector('.wrapp_wishlist');
       if(items && Object.keys(items).length && wrapp)
        {
            let countItems = Object.keys(items);
            let html = ``;
            if(countItems){
               let sum = 0;
               countItems.forEach((v,k) => {
                   sum += Number(items[v].price) * Number(items[v].qty);
                   html += `
                   <div class="wish_list__listing">
                   <ul>
                       <li style="background:url(${items[v].img.replace(/public/gi, "")}) no-repeat center;background-size: contain"></li>
                       <li>${items[v].title}</li>
                       <li>${items[v].price}</li>
                       <input id='price' name='price' type='hidden' value='${items[v].price}'>
                       <input name='id' type='hidden' value='${v}'>
                       <input form="del_up" type="text" name="qty" class="qty" style="${(Basket.nameClass() == "wishlist") ? "visibility:hidden" : ""}" value="${items[v].qty}">
                       <form method="post onsubmit="return false">
                           <label for="del_wish${k}" class="del_wish">
                            <input onclick="Basket.deleteItemFromBasket(${v})" name="delete" type="submit" id="del_wish${k}"></label>
                       </form>
                       <input form="del_up" name="${items[v].id}" type="hidden" value="${items[v].id}">
                   </ul>
               </div>`});
               wrapp.innerHTML = `${html}
               <p class="total" style="${(Basket.nameClass() == "wishlist") ? "visibility:hidden" : ""}">Total: ${sum}</p>
               
               <div class="wrapp_btns">
                <form method="post" onsubmit="return false" id="del_up" ></form>
                <form method="post" onsubmit="return false" id="deleteall" action="basket/deleteall"></form>
                <a href='order' class="orders" style="${(Basket.nameClass() == "wishlist") ? "visibility:hidden" : ""}">Order</a>
                <label for="del" class="del">Delete All<input onclick="Basket.deleteAll()" form="deleteall" type="submit" name="deleteAll" id="del" value=""></label>
                <label for="update" form="del_up" class="update" style="${(Basket.nameClass() == "wishlist") ? "visibility:hidden" : ""}">Update<input onclick="Basket.updateBasket()" type="submit" form="del_up" name="put" id="update"></label>
            </div>
               `;
            }
        }
        else{
            if(document.querySelector('.wish_list'))
            {
                document.querySelector('.wish_list').innerHTML=`<div class="empty_wish_list">Your ${Basket.nameClass().charAt(0).toUpperCase() + Basket.nameClass().slice(1)} is Empty</div>`;
            }
        }
        
    }

    static updateBasket()
    {
        let parse = JSON.parse(localStorage.getItem(Basket.nameClass()));
        [...document.querySelectorAll('.wish_list__listing > ul')].forEach(v => {
            parse[v.querySelector('input[name=id]').value]['qty'] = v.querySelector('input[name=qty]').value;
        })
        localStorage.setItem(Basket.nameClass(), JSON.stringify(parse));
        Basket.showBasketItem();
        Basket.addCurrencyInBasketPage();
    }

    static deleteItemFromBasket(id)
    {
        let parse = JSON.parse(localStorage.getItem(Basket.nameClass()));
        delete parse[id];
        localStorage.setItem(Basket.nameClass(), JSON.stringify(parse));
        Basket.countBasket();
        Basket.showBasketItem();
        Basket.addCurrencyInBasketPage();

    }

    static deleteAll()
    {
        localStorage.removeItem(Basket.nameClass());
        Basket.countBasket();
        Basket.countWishList();
        Basket.showBasketItem();
    }

    static addCurrencyInBasketPage()
    {
        let divPrice = document.querySelectorAll('.wish_list__listing ul > li:nth-child(3)');
        let sum = 0;
        if(divPrice.length > 0){
            [...divPrice].forEach(v => {
              let price = Number(v.parentElement.querySelector('input[name=price]').value);
              let qty = Number(v.parentElement.querySelector('input[name=qty]').value);
              sum += Number(price) * Number(qty);
               v.textContent = String(( price * JSON.parse(localStorage.getItem("currency"))["rate"]).toFixed(2)) +
            " " + Currency.decodeHTML(Currency.getSymbol()) })
           
            document.querySelector('.total').textContent = 'Total: ' + String(( sum * JSON.parse(localStorage.getItem("currency"))["rate"]).toFixed(2)) +
          " " + Currency.decodeHTML(Currency.getSymbol());
        }

    }

    static go()
    {
        Basket.countBasket();
        Basket.countWishList();
        Basket.showBasketItem(); 
        Basket.btnBasketBg();
        Basket.btnWishListBg();
        Basket.addBasket();
        Basket.addWishList();
        Basket.addCurrencyInBasketPage();
    }
}

Basket.go();