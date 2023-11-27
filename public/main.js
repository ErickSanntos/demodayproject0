var save= document.getElementsByClassName("fa-bookmark");
var trash = document.getElementsByClassName("fa-trash-alt");
var editIcon= document.getElementsByClassName("fa-pen");
// var editIcon = document.getElementById("editIcon");


document.addEventListener('DOMContentLoaded', function() {
  // Get references to the elements
  const getStartedButton = document.getElementById('getStartedButton');
  const editIcon = document.getElementById('editIcon');
  const postForm = document.getElementById('postForm'); // This is your POST form
  const putForm = document.getElementById('putForm'); // This is your PUT form

  // Add event listener for the "Get Started" button
  getStartedButton.addEventListener('click', function() {
    postForm.style.display = 'block';
    putForm.style.display = 'none';
    postForm.setAttribute('method', 'POST');
  });

  // Add event listener for the edit icon
  editIcon.addEventListener('click', function() {
    console.log('Edit icon clicked'); // Add this line for debugging
    putForm.style.display = 'block';
    postForm.style.display = 'none';
    putForm.setAttribute('method', 'PUT');
  });
  
});
document.querySelectorAll('.job-item .fa-bookmark').forEach(function(bookmarkIcon) {
  bookmarkIcon.addEventListener('click', function() {
    // 'this' refers to the clicked bookmark icon.
    // Using closest('.job-item') to navigate up to the parent job item.
    const jobItem = this.closest('.job-item');
    
    // Extract the jobId from the jobItem's data-id attribute.
    const jobId = jobItem.getAttribute('data-id');
    if (!jobId) {
      console.error('Job ID not found');
      return;
    }

    // Fetch request to send jobId to the server.
    fetch('/addToProfile', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        'jobId': jobId
        // You can add other job details here if needed.
      })
    })
    .then(response => {
      if (response.ok) return response.json();
        this.classList.add('bookmarked');
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      console.log(data);
      // Update the UI to indicate the job has been bookmarked.
      // For example, change the color of the bookmark icon or show a message.
    })
    .catch(error => {
      console.error('Fetch error:', error);
      // Handle the error (e.g., show an error message to the user).
    });
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

///////// for login 
// Add an event listener to the "Apply" button
document.querySelectorAll('.apply-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    const creatorEmail = event.currentTarget.getAttribute('data-creator-email');
    const confirmationMessageElement = document.getElementById('emailConfirmationMessage');
    const iconCountElement = document.querySelector('.icon-count');

    fetch('/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ creatorEmail }),
    })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Email request failed');
      }
    })
    .then((data) => {
      // Update the confirmation message
      confirmationMessageElement.innerHTML = 'Application submitted successfully! Someone will contact you soon.';
      confirmationMessageElement.style.display = 'block';

      // Animate the dropdown effect
      confirmationMessageElement.classList.add('dropdown-animation');

      // Increment the count in the icon-count span
      let currentCount = parseInt(iconCountElement.textContent);
      iconCountElement.textContent = currentCount + 1;

      console.log(data);

      // Optionally hide the message after a few seconds
      setTimeout(() => {
        confirmationMessageElement.style.display = 'none'; // Hide the message
        confirmationMessageElement.classList.remove('dropdown-animation');
      }, 5000); // Adjust time as needed
    })
    .catch((error) => {
      console.error('Error:', error);
      confirmationMessageElement.innerHTML = 'Error submitting application. Please try again.';
      confirmationMessageElement.style.display = 'block';
      confirmationMessageElement.classList.add('dropdown-animation');
    });
  });
});




/////////////
// Get the modal
var modal = document.getElementById('createJobModal');

// Get the button that opens the modal
var btn = document.getElementById('createJobBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = 'block';
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = 'none';
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
}

///////

// create info button
// JavaScript to open and close the modal
const profileModal = document.getElementById('updateProfileModal');
const profileModalCloseBtn = document.querySelector('#updateProfileModal .close');

// Function to open the profile update modal
function openProfileModal() {
  profileModal.style.display = 'block';
}

// Add event listener to the profile modal open button
document.getElementById('openProfileModalBtn').addEventListener('click', openProfileModal);

// Function to close the modal
profileModalCloseBtn.onclick = function() {
  profileModal.style.display = 'none';
}

// Close the modal if clicked outside of it
window.onclick = function(event) {
  if (event.target === profileModal) {
    profileModal.style.display = 'none';
  }
}




document.addEventListener('DOMContentLoaded', function() {
  const signUpButton = document.querySelector('.overlay-panel.overlay-right #signUp');

  const signInButton = document.getElementById('signIn');
  const container = document.getElementsByClassName('container')[0]; // Make sure to select the first element with this class

  signUpButton.addEventListener('click', () => {
      console.log('Sign Up button clicked');
      container.classList.add("right-panel-active");
  });

  signInButton.addEventListener('click', () => {
      console.log('Sign In button clicked');
      container.classList.remove("right-panel-active");
  });
});

