// SECTION Name Logic

const name_input = document.getElementById("name");

name_input.value = localStorage.getItem("name");
name_input.addEventListener("change", () => 
{
    localStorage.setItem("name", name_input.value);
});

// SECTION Item Logic

let items = [];
items = JSON.parse(localStorage.getItem("items")) || Array.prototype;

class Item 
{
    constructor(front, back, type)
    {
        this.front = front;
        this.back = back;
        this.type = type;
        this.stage = 0;
        this.reviewDate = new Date();
    }
}

function AddItem(front, back, type)
{
    items.push(new Item(front, back, type));
    localStorage.setItem("items", JSON.stringify(items));
    findDueItems();
}

console.log(items);

// SECTION Review Logic

let due_item_indexes = [];
let shuffled_due_item_indexes = [];

function shuffleDueItems()
{
    shuffled_due_item_indexes = [ ...due_item_indexes ];
    for(let i = 0; i < due_item_indexes.length; i++)
    {
        const random = Math.floor(Math.random() * shuffled_due_item_indexes.length);    
        [shuffled_due_item_indexes[i], shuffled_due_item_indexes[random]] = [shuffled_due_item_indexes[random], shuffled_due_item_indexes[i]];
    }
}

let currentReviewIndex = 0;
const prompt_label = document.getElementById("prompt");
function updateCard()
{
    if(items.length > 0)
    {
        prompt_label.innerText = items[shuffled_due_item_indexes[currentReviewIndex]].front;
    }
}

function findDueItems()
{
    const now = Date.parse(new Date());
    for(let i = 0; i < items.length; i++)
    {
        if((Date.parse(items[i].reviewDate) - now) < 0)
        {
            due_item_indexes.push(i)
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
    && reviews_input.value == items[shuffled_due_item_indexes[currentReviewIndex]].front)
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