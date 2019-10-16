const Slider = () => {
  return `
        <section class="slider_mobile">
        <ul class="rslides">
            <li>
                <h1>Electrolux &apos;Supercyclone&apos; Vacuum Cleaner</h1>
                <p>Comfort is a very important thing nowadays because it is a condition of satisfaction</p>
                <img src="img/items/product-1-448.png" alt=""/><a href="/category/Vacuum-Cleaner" class="btn_details">Details</a></li>
            <li>
                <h1>Panasonic HC-VX870 4K Ultra HD Camcorder</h1>
                <p>Comfort is a very important thing nowadays because it is a condition of satisfaction</p>
                <img src="img/items/product-34-448.png" alt=""/><a href="/category/cameras" class="btn_details">Details</a></li>
            <li>
                <h1>Siemens Steam Iron</h1>
                <p>Comfort is a very important thing nowadays because it is a condition of satisfaction</p>
                <img src="img/items/product-55-448.png" alt=""/><a href="/category/irons" class="btn_details">Details</a></li>
        </ul>
    </section>
<section class="slider">
        <ul class="rslides">
            <li>
                <div class="desc">
                    <h1>Electrolux &apos;Supercyclone&apos; Vacuum Cleaner</h1>
                    <p>Comfort is a very important thing nowadays because it is a condition of satisfaction</p>
                    <a href="/category/Vacuum-Cleaner" class="btn_details">Details</a>
                </div>
                <div class="img_product"><img src="img/items/product-1-448.png" alt=""/></div></li>
            <li><div class="desc">
                    <h1>Panasonic HC-VX870 4K Ultra HD Camcorder</h1>
                    <p>Comfort is a very important thing nowadays because it is a condition of satisfaction</p>
                    <a href="/category/cameras" class="btn_details">Details</a>
                </div>
                <div class="img_product"><img src="img/items/product-34-448.png" alt=""/></div></li>
            <li><div class="desc">
                    <h1>Siemens Steam Iron </h1>
                    <p>Comfort is a very important thing nowadays because it is a condition of satisfaction</p>
                    <a href="/category/irons" class="btn_details">Details</a>
                </div>
                <div class="img_product"><img src="img/items/product-55-448.png" alt=""/></div></li>
        </ul>
    </section>
        `;
};

const SpecialItems = data => {
  return `
        <div class="specials">Specials</div>
        ${data.home
          .slice(26, 30)
          .map(
            v => `
            <article class=\"item_special\">
            <span class=\"sale\"></span>
            <div class=\"item__img\" style=\"background: url(${v.img_small.replace(
              /public/gi,
              ""
            )}) no-repeat; background-size: contain;\"></div>
            <div class=\"item__desc\"><a href=item/${v.url}>${v.title}</a></div>
            <div class=\"item__price\">${v.price}</div>
        </article>`
          )
          .join("")}
            </nav><main>`;
};

const LatestItems = data => {
  return `<section class="latest">Latest</section>
    <section class="latest_wrapper ">
    ${data.home
      .slice(0, 4)
      .map(
        v => `
       <article class="latest__item">
            <span></span>
            <div class="latest__item__img" style="background:url(${v.img_medium.replace(
              /public/gi,
              ""
            )}) no-repeat; background-size:contain; background-position:center;"></div>
           <div class="item__price">${v.price}</div>
           <a href="/item/${v.url}">
           <div class="latest__item__desc">${v.title}</div></a>
            <form method="post">
                <input name='id' type='hidden' value='${v.id}'>
                <input name='title' type='hidden' value='${v.title}'>
                <input id='price' name='price' type='hidden' value='${v.price}'>
                <input name='img' type='hidden' value='${v.img_small}'>
                <input name='url' type='hidden' value='/item/${v.url}'>
                <input name='qty' type='hidden' value='1'>
                <input name="add_basket" type="submit" class="add_basket" value="" >
                <input name="add_wish" type="submit" class="add_wish" value="" >
            </form>
        </article>
    `
      )
      .join("")}
    </section>`;
};

const FeaturedItems = data => {
  return `
        <section class="latest" style="margin-top: 38px;">Featured</section>
<section class="latest_wrapper dvesti featured latest_featured">
        ${data.home
          .slice(15, 19)
          .map(
            v => `           
            <article class="latest__item">
            <div class="latest__item__img" style="background:url(${v.img_medium.replace(
              /public/gi,
              ""
            )}) no-repeat; background-size:contain; background-position:center;"></div>
           <div class="item__price">${v.price}</div>
           <a href="/item/${v.url}">
           <div class="latest__item__desc">${v.title}</div></a>
            <form method="post">
                <input name='id' type='hidden' value='${v.id}'>
                <input name='title' type='hidden' value='${v.title}'>
                <input name='price' type='hidden' value='${v.price}'>
                <input name='img' type='hidden' value='${v.img_small}'>
                <input name='url' type='hidden' value='/item/${v.url}'>
                <input name='qty' type='hidden' value='1'>
                <input name="add_basket" type="submit" class="add_basket" value="" >
                <input name="add_wish" type="submit" class="add_wish" value="" >
            </form>
        </article>`
          )
          .join("")}
</section>
<section class="latest specials_mq" style="margin-top: 30px;">
Special
</section>
<section class="latest_wrapper bestsellers_wraper special_wrapp">
${data.home
  .slice(15, 19)
  .map(
    v => `
    <article class="latest__item">
    <span></span>
    <div class="latest__item__img" style="background:url(${v.img_medium.replace(
      /public/gi,
      ""
    )}) no-repeat; background-size:contain; background-position:center;"></div>
   <div class="item__price">${v.price}</div>
   <a href="/item/${v.url}">
   <div class="latest__item__desc">${v.title}</div></a>
    <form method="post">
        <input name='id' type='hidden' value='${v.id}'>
        <input name='title' type='hidden' value='${v.title}'>
        <input name='price' type='hidden' value='${v.price}'>
        <input name='img' type='hidden' value='${v.img_small}'>
        <input name='url' type='hidden' value='${v.url}'>
        <input name='qty' type='hidden' value='1'>
        <input name="add_basket" type="submit" class="add_basket" value="" >
        <input name="add_wish" type="submit" class="add_wish" value="" >
    </form>
</article>
    `
  )
  .join("")}
</section>
<section class="latest_wrapper bestsellers_wraper latest_featured" style="margin-bottom: 330px;">
</section>`;
};
module.exports = [SpecialItems, Slider, LatestItems, FeaturedItems]