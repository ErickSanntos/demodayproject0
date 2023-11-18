var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash-alt");

Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const location= this.parentNode.parentNode.childNodes[1].innerText
        const jobtype = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('messages', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'location': location,
            'jobtype': jobtype,
            'thumbUp':thumbUp
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});



Array.from(trash).forEach(function(element) {
  element.addEventListener('click', function(){
    const listItem = this.closest('.job-item'); // More robust way to find the parent <li>
    if (!listItem) {
      console.error('Job item not found');
      return;
    }
    const id = listItem.dataset.id;
    if (!id) {
      console.error('ID not found');
      return;
    }

    fetch('joblistings', {
      method: 'delete',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ 'id': id })
    }).then(function (response) {
      window.location.reload();
    });
  });
});


///////////
/////////// for login 
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementsByClassName('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});