// SECTION Name Logic

const name_input = document.getElementById("name");

name_input.value = localStorage.getItem("name"); // read the current name from localstorage
name_input.addEventListener("change", () => // if user types
{
    localStorage.setItem("name", name_input.value); // then change the localstorage value 
});

// SECTION Item Logic

let items = []; // initialize items as an empty array
items = JSON.parse(localStorage.getItem("items")) || Array.prototype; // try to retrieve localstorage's items, otherwise set it to an empty array

class Item 
{
    constructor(front, back, type)
    {
        this.front = front; // the prompt the user will see
        this.back = back; // the answer to the flashcard
        this.type = type; // the type of the flashcard, currently suported: type
        this.stage = 0; // the SRS stage of the item, default 0
        this.reviewDate = new Date(); // the review date of the item, default date of creation
    }
}

function AddItem(front, back, type)
{
    items.push(new Item(front, back, type)); // push the item to items
    localStorage.setItem("items", JSON.stringify(items)); // update the local storage's value
    findDueItems(); // refind and reshuffle all due items
}

// SECTION Review Logic

let due_item_indexes = []; // initialize an empty array of due items
let shuffled_due_item_indexes = []; // ^

function shuffleDueItems()
{
    shuffled_due_item_indexes = [ ...due_item_indexes ]; // clone the due items
    for(let i = 0; i < shuffled_due_item_indexes.length; i++) // loop through each item
    {
        const random = Math.floor(Math.random() * shuffled_due_item_indexes.length); // find a random number between 1 and the array's öength 
        [shuffled_due_item_indexes[i], shuffled_due_item_indexes[random]] 
        = [shuffled_due_item_indexes[random], shuffled_due_item_indexes[i]]; // swap places with said found index
    }
}

let currentReviewIndex = 0; // user reviews always start at index 0
const prompt_label = document.getElementById("prompt");
function updateCard()
{
    if(items.length > 0) // make sure there is an item
    {
        prompt_label.innerText = items[shuffled_due_item_indexes[currentReviewIndex]].front; // set the prompt label to the current item's prompt
    } else 
    {
        prompt_label.innerText = "why are you here?"; // "easter egg"
    }
}

function findDueItems() 
{
    const now = Date.parse(new Date()); // find the current time
    for(let i = 0; i < items.length; i++) // loop through each item in items
    {
        if((Date.parse(items[i].reviewDate) - now) < 0) // if the review date of the item has passed
        {
            due_item_indexes.push(i) // then push it to the due items
        }
    }
    shuffleDueItems(); // shuffle all of the items
    updateCard(); // update the review card
}

const reviews_form = document.getElementById("reviews-form");
const reviews_input = document.getElementById("reviews-input");

reviews_form.addEventListener("submit", e => // listen for a submit from the review input
{
    e.preventDefault(); // prevent the page from reloading
    if(reviews_input.value == items[shuffled_due_item_indexes[currentReviewIndex]].back) // if the value is correct
    {
        items[shuffled_due_item_indexes[currentReviewIndex]].stage += 1;
        items[shuffled_due_item_indexes[currentReviewIndex]].reviewDate = 
            calculateReviewDate(items[shuffled_due_item_indexes[currentReviewIndex]].stage);

        localStorage.setItem("items", JSON.stringify(items)); // update the local storage's value

        currentReviewIndex++;
        if(currentReviewIndex < shuffled_due_item_indexes.length)
        {
            updateCard();
        } else 
        {
            home.classList.remove("hidden"); // shows the homepage
            reviews.classList.add("hidden"); // hides the review page
            
            const now = Date.parse(new Date()); // find the current time
            for(let i = 0; i < items.length; i++) // loop through each item in items
            {
                if((Date.parse(items[i].reviewDate) - now) < 0) // if the review date of the item has passed
                {
                    due_item_indexes.push(i) // then push it to the due items
                }
            }
            shuffleDueItems(); // shuffle all of the items
        }
    }
});

// SECTION Backup Button Logic

const backup_button = document.getElementById("generate-backup");

backup_button.addEventListener("click", () => // listen for clicks on the backup button
{
    const B64 = btoa(localStorage.getItem("items")); // encode the localstorage data
    const p = document.createElement("p"); // create a p element
    p.innerText = B64; // set the text content to said encoded text
    p.style.display = "none"; // hide the element
    document.body.append(p); // append the element to DOM
    navigator.clipboard.writeText(p.innerText); // copy the value of the inner text
    p.remove(); // remove the p element
})

// SECTION Recovery Logic

const recovery_input = document.getElementById("recover-input");
const recovery_button = document.getElementById("recover-button");

recovery_button.addEventListener("click", () => // listen for clicks on the recovery button
{
    items = items.concat(JSON.parse(atob(recovery_input.value)) || []); // append the loaded items from Base64 code to the items
    localStorage.setItem("items", JSON.stringify(items)); // update the local storages item
    findDueItems();
});

// SECTION Navigation

/* pages */
const home = document.getElementById("home");
const creator = document.getElementById("creator");
const reviews = document.getElementById("reviews");

/* buttons */
const creator_button = document.getElementById("creator-button");
const review_button = document.getElementById("review-button")
const home_button_from_creator = document.getElementById("creator-back");
const home_button_from_reviews = document.getElementById("reviews-back");

creator_button.addEventListener("click", () => // listen for clicks on the creator button
{
    home.classList.add("hidden"); // hides the homepage
    creator.classList.remove("hidden"); // shows the creator
});

home_button_from_creator.addEventListener("click", () => // listen for clicks on the home button
{
    home.classList.remove("hidden"); // shows the homepage
    creator.classList.add("hidden"); // hides the creator
    findDueItems(); // searches for due items
}); 

review_button.addEventListener("click", () => // listen for clicks on the review button
{
    home.classList.add("hidden"); // hides the homepage
    reviews.classList.remove("hidden"); // shows the review page
    currentReviewIndex = 0; // resets the review index
});

home_button_from_reviews.addEventListener("click", () => 
{
    home.classList.remove("hidden"); // shows the homepage
    reviews.classList.add("hidden"); // hides the review page
    findDueItems(); // searches for due items
});

// SECTION Creator Logic

const front_side_creator_input = document.getElementById("creator-front");
const back_side_creator_input = document.getElementById("creator-input-back");
const add_to_deck_button = document.getElementById("creator-create-button");

add_to_deck_button.addEventListener("click", () => // listen for clicks on the "add card" button
{
    if(front_side_creator_input.value != "" && back_side_creator_input != "") // if there is actual input
    {
        AddItem(front_side_creator_input.value, back_side_creator_input.value, "type_in"); // then register the item
        review_button.innerHTML = due_item_indexes.length + " reviews"; // and update the ammount of due items
    }
    front_side_creator_input.value = ""; back_side_creator_input.value = ""; // reset the values of the card
});

// SECTION Initial function calls

findDueItems(); // find initial due items
review_button.innerHTML = due_item_indexes.length + " reviews"; // set the due items

// SECTION Review date

function calculateReviewDate(stage)
{
    let d = new Date();
    return d.setTime(d.getTime() + (3600000 * ((Math.pow(4, stage) / (2 * stage)) + stage)));
}