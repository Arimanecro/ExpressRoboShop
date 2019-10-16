chunk = (arr, size) =>
arr.reduce(
  (chunks, el, i) =>
    (i % size ? chunks[chunks.length - 1].push(el) : chunks.push([el])) &&
    chunks,
  []
);

function displayPages(size, perPage, category=null) {
  let arr = [];
  let count = Math.round(size / perPage) + 1;
  for (let i = 1; i < count; i++) {
    arr.push(`<li><a href ='/search/${category}/${i}#top'>${i}</a></li>`);
  }
  return arr;
}

module.exports = (docs) => {
    let {word, countPage, length, data} = docs;
    countPage = (length) ? countPage: 0;
    if(countPage) {data = chunk(data,4);} 
    return `
    </nav><main>
    <section id="top" class="latest title_category_items" style="width: 100%;">SEARCH [ ${countPage} matches ]</section>
    ${countPage ?
        data.map(
        v1 => `<section class="latest_wrapper category_items" style="width: 100%;
        display: flex;  justify-content: space-between;">
        ${v1.map(v => `<article class="latest__item">
            <div class="latest__item__img" style="background:url(${v.img_medium.replace(/public/gi, "")}) no-repeat; background-size:contain; background-position:center;"></div>
           <div class="item__price">${v.price}</div>
           <a href="/item/${v.url}">
           <div class="latest__item__desc">${v.title}</div></a>
            <form method="get" onsubmit="(e)=>e.preventDefault()">
                <input name='id' type='hidden' value='${v.id}'>
                <input name='title' type='hidden' value='${v.title}'>
                <input id='price' name='price' type='hidden' value='${v.price}'>
                <input name='img' type='hidden' value='${v.img_small}'>
                <input name='url' type='hidden' value='${v.url}'>
                <input name='qty' type='hidden' value='1'>
                <input name="add_basket" type="submit" class="add_basket" value="" >
                <input name="add_wish" type="submit" class="add_wish" value="" >
            </form>
        </article>`)}
        </section>
        `).join("") : ''}
        ${(countPage > 16) ? `<div class="paginator" style="margin: 0 auto;">
        <ul>
          ${displayPages(countPage, 16, word).map(v => v)}
        </ul>
      </div>`
    : (!countPage ? '<h1 style="font-family: \'Athiti\', sans-serif\;font-size: 1.5em;">No matches</h1>': '')  }
    <section class="latest_wrapper bestsellers_wraper latest_featured" style="display:block;margin-bottom: 330px;"></section>`.replace(/[, ]+/g, " ")
}