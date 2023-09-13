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
    shuffleDueItems();
    updateCard();
}

const reviews_form = document.getElementById("reviews-form");
const reviews_input = document.getElementById("reviews-input");

reviews_form.addEventListener("submit", e => 
{
    e.preventDefault();
    if(reviews_input.value != ""
    && reviews_input.value == items[shuffled_due_item_indexes[currentReviewIndex]].back)
    {
        alert("success!");
    }
});

findDueItems();

// SECTION Review Button Logic

const item_ammount_text = document.getElementById("item-ammount");

item_ammount_text.innerHTML = due_item_indexes.length + " reviews";

// SECTION Backup Button Logic

const backup_button = document.getElementById("generate-backup");

backup_button.addEventListener("click", () => 
{
    const B64 = btoa(localStorage.getItem("items"));
    const p = document.createElement("p");
    p.innerText = B64;
    p.style.display = "none";
    document.body.append(p);
    navigator.clipboard.writeText(p.innerText);
    p.remove();
})

// SECTION Recovery Logic

const recovery_input = document.getElementById("recover-input");
const recovery_button = document.getElementById("recover-button");

recovery_button.addEventListener("click", () => 
{
    items = items.concat(JSON.parse(atob(recovery_input.value)) || []);
    localStorage.setItem("items", JSON.stringify(items));
});

// SECTION Navigation

/* pages */
const home = document.getElementById("home");
const creator = document.getElementById("creator");
const reviews = document.getElementById("reviews");

/* buttons */
const creator_button = document.getElementById("creator-button");
const home_button_from_creator = document.getElementById("creator-back");
const home_button_from_reviews = document.getElementById("reviews-back");

creator_button.addEventListener("click", () => 
{
    home.classList.add("hidden");
    creator.classList.remove("hidden");
    findDueItems();
});

home_button_from_creator.addEventListener("click", () => 
{
    home.classList.remove("hidden");
    creator.classList.add("hidden");
    findDueItems();
});

item_ammount_text.addEventListener("click", () => 
{
    home.classList.add("hidden");
    reviews.classList.remove("hidden");
    findDueItems();
    currentReviewIndex = 0;
});

home_button_from_reviews.addEventListener("click", () => 
{
    home.classList.remove("hidden");
    reviews.classList.add("hidden");
    findDueItems();
    currentReviewIndex = 0;
});

// SECTION Creator Logic

const front_side_creator_input = document.getElementById("creator-front");
const back_side_creator_input = document.getElementById("creator-input-back");
const add_to_deck_button = document.getElementById("creator-create-button");

add_to_deck_button.addEventListener("click", () => 
{
    if(front_side_creator_input.value != "" && back_side_creator_input != "")
    {
        AddItem(front_side_creator_input.value, back_side_creator_input.value, "type_in");
        item_ammount_text.innerHTML = due_item_indexes.length + " reviews";
    }
    front_side_creator_input.value = ""; back_side_creator_input.value = "";
});