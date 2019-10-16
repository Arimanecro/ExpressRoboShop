class FirebaseAuth
{

  constructor() {

    this.firebaseConfig = {
    apiKey: "*************",
    authDomain: "roboshop-9ef9d.firebaseapp.com",
    databaseURL: "https://roboshop-9ef9d.firebaseio.com",
    projectId: "roboshop-9ef9d",
    storageBucket: "roboshop-9ef9d.appspot.com",
    messagingSenderId: "61334982360",
    appId: "1:61334982360:web:946eb40d9dd8fa14"
  };
    this.userName = '';

  firebase.initializeApp(this.firebaseConfig);

  firebase.auth().onAuthStateChanged((user) => {
    if(user) { this.userName = user.displayName; 
               this.checkAuthTime(user.metadata.b);
              };
    return user ? this.showListOrder(user.displayName) 
                :  this.showAuthIcons();
  })
  }

  checkAuthTime(time) {
    if(time) {
      if((Date.now() - Number(time)) > 86400000) //1day
      firebase.auth().signOut(); 
    }
  }

  showListOrder(name, msgWasDel=null) {

  let query = { query: `{ showOrders { _id, name, address, email, items {id, title, price, qty}, total } }`};
  
  this.sendRequest(query).then(data => {
    data = data.data.showOrders;

    msgWasDel = msgWasDel ? `<div id="msgDel">${msgWasDel}</div>` : "";
    
    const html = Object.keys(data).length > 0
      ? `
      <div class="application__content">
      ${msgWasDel}
      <p>Hello <span>${name}!</span> You can only read.</p>
      <p>===================================</p>
      ${data.map(
        v => `
      <p><strong>Order ID:</strong> ${v._id}</p>
      <p><strong>Name:</strong> ${v.name}</p>
      <p><strong>Address:</strong> ${v.address}</p>
      <p><strong>Email:</strong> ${v.email}</p>
      <p><strong>Items:</strong></p>
      <ul style='display:block;margin-left:20px;'>
      ${v.items.map(
        i =>
          `<li><strong>Item ID: </strong>${i.id}</li></br>
          <li><strong>TITLE: </strong>${i.title}</li></br>
          <li><strong>PRICE: </strong>${i.price}</li></br>
          <li><strong>QTY: </strong>${i.qty}</li></br></br>`
      )}
      </ul>
      <span>---------------------<span>
      <p style="color: green;"><strong>TOTAL: ${v.total} $</strong></p>
      <span>---------------------<span>
      <div style="color: red;">DELETE</div>
      <div class="wrapp_order" style='margin:0'>
      <label name="delOrder" class="del_wish" data-value='${v._id}'>
      </div>
      <span>==================</span>
      `
      )}
      </div>
      <section class="latest_wrapper bestsellers_wraper latest_featured" style="display:block;margin-bottom: 330px;"></section>`
      : `<h1>No Orders!</h1>`;
      
      document.getElementById('orders').innerHTML = `
      <span style="display: flex;
      justify-content: space-around;
      align-items: center;
      width: 121px;
      border: 2px solid #ed7899;
      border-radius: 50px;
      position: relative;
      top: 3px;
      ">
      <strong>LogOut</strong>
      <button id="signOut"></button>
      </span>
      <p>+++++++++++++++++++++++++</p>${html}`;

      this.activateDelOrderBtns();
  
      document.getElementById("signOut").addEventListener('click', () => {
        firebase.auth().signOut();
      });
  });

}

  showAuthIcons()
{
  this.clearIndexedDb();

  const buttons =  `
  <h1 style="font-family: 'Athiti', sans-serif">You must be authenticated</h1>
  <button id="facebook"></button>
  <button id="google"></button>
  <button id="github"></button>
  `
  document.getElementById('orders').innerHTML = buttons;

  const f = document.getElementById("facebook");
  const goo = document.getElementById("google");
  const git = document.getElementById("github");

  f.addEventListener('click', () => {

    const provider = new firebase.auth.FacebookAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(err => {
        this.errMsg(err, "was logged via Gmail or Github")
      })
  });
  
  goo.addEventListener('click', () => {
      
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(err => {
        this.errMsg(err, "was logged via Facebook or Github");
      })
  })

  git.addEventListener('click', () => {
      
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).catch(err => {
      this.errMsg(err, "was logged via Gmail or Facebook");
    })
  });
}

  sendRequest(query) {
    return fetch(`${location.protocol}//${location.host}/graphql`, {
          method: 'post',
          body:    JSON.stringify(query),
          headers: { 'Content-Type': 'application/json' },
      })
      .then(res => res.json() )
      .catch(e => console.error(e));
  }

  activateDelOrderBtns()
  {
    document.getElementsByName('delOrder').forEach(
      (v) => {
        v.addEventListener('click', e => {
          let query = { query: `mutation { deleteOrder(id:"${e.target.dataset.value}") }`};
          this.sendRequest(query)
          .then(r => {
            this.showListOrder(this.userName, r.data.deleteOrder);
          })
          .catch(e => console.error(e));
      }
    ) })
  }

  errMsg(err, text){
    if(err.code == 'auth/account-exists-with-different-credential')
    {
      console.log(`${err.email} ${text}`)
    }
    else { console.log(err.message) }
  }

  clearIndexedDb() {

  const openRequest = indexedDB.open('firebaseLocalStorageDb', 1);
  
  openRequest.onerror = () => console.error("Error", openRequest.error);

  openRequest.onsuccess = () => {
      let db = openRequest.result;
      const objectStore = db.transaction("firebaseLocalStorage", "readwrite").objectStore("firebaseLocalStorage")
      objectStore.clear();
  };
}
  
}

export default new FirebaseAuth(); 
