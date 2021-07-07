//npm run json:server

import { http } from './http';
import { ui } from './ui';

//get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);

//listen for adding post
document.querySelector('.post-submit').addEventListener('click', submitPost);

//listen for removing post
document.querySelector('#posts').addEventListener('click', deletePost);

//listen for edit state...click changes the state adding the post, adds buttons
document.querySelector('#posts').addEventListener('click', enableEdit);

//listen for cancel
document.querySelector('.card-form').addEventListener('click', cancelEdit);

//get posts
function getPosts() {
    http.get('http://localhost:3000/posts')
        .then((data) => ui.showPosts(data))
        .catch((error) => {
            console.log(error);
        }); 
}

//add posts
function submitPost() {
    const title = document.querySelector('#title').value;
    const body = document.querySelector('#body').value;
    const id = document.querySelector('#id').value;

    const data = {
        title: title,
        body: body
    }
    
    //validate inputs
    if(title === '' || body === '') {
        ui.showAlert('Please fill in al fields', 'alert alert-danger');
    } else {

        

        //check for id
        if(id === '') {
            //create post
        http.post('http://localhost:3000/posts', data)
        .then(data => {
            ui.showAlert('Post added', 'alert alert-success');
            ui.clearFields();
            getPosts();
        })
        .catch(error => console.log(error));
        } else {
            //update the post
            http.put(`http://localhost:3000/posts/${id}`, data)
        .then(data => {
            ui.showAlert('Post Updated', 'alert alert-success');
            ui.changeFormState('add');
            getPosts();
        })
        .catch(error => console.log(error));
        }
    }
}

//delete posts

function deletePost(event) {
    event.preventDefault();
    if(event.target.parentElement.classList.contains('delete')) {
        const id = event.target.parentElement.dataset.id;
        if(confirm('Are you sure?')) {
            http.delete(`http://localhost:3000/posts/${id}`)
                .then((data) => {
                    ui.showAlert('Post Removed', 'alert alert-success');
                    getPosts();
                })
                .catch((error) => console.log(error));
        }
    }
}

//enable edit state
function enableEdit(event) {
    if(event.target.parentElement.classList.contains('edit')) {
        const id = event.target.parentElement.dataset.id;
        const title = event.target.parentElement.previousElementSibling.previousElementSibling.textContent;
        const body = event.target.parentElement.previousElementSibling.textContent;

        const data = {
            id,
            title,
            body
        }

        //fill the form with the current post
        ui.fillForm(data);
    }
    event.preventDefault();
}

//cancel edit state
function cancelEdit(event) {
    if(event.target.classList.contains('post-cancel')) {
        ui.changeFormState('add');
    }

    event.preventDefault();
}