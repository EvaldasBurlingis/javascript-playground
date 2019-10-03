/*
BUDGET CONTROLLER
---------------------------- */
let budgetController = (function(){

    const Expense = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    const Income = function(id, desc, value) {
        this.id = id;
        this.desc = desc;
        this.value = value;
    }

    // Keeps all data in one structure
    let data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: 0,
    };
    
    const calculateTotal = (type) => {
        let sum = 0;

        data.allItems[type].map(item => {
            sum += item.value;
        })

        return data.totals[type] = sum;
    }

    return {
        addItem: function(type, desc, value){
            let newItem, ID;
            
            // Create ID 
            // Last number of item id + 1
            // if no items start at 0
            if (data.allItems[type].length === 0){
                ID = 0
            } else {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }

            //Create new item
            if(type === "exp"){
                newItem = new Expense(ID, desc, value);
            } else if(type === "inc") {
                newItem = new Income(ID, desc, value);
            }

            // Push item into data structure
            data.allItems[type].push(newItem)

            return newItem;
        },
        
        test: function() {
            return console.log(data);
        },

        calculateBudget: function(){
            // calculate total income and exp
            calculateTotal("exp");
            calculateTotal("inc");

            // total budget
            data.budget = data.totals.inc - data.totals.exp;

            // % of income that is our expenses
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

        },
        getBudget: function() {
            return {
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                budget: data.budget,
                percentage: data.percentage
            }
        }
    }

})();


/*
UI ELEMENT CONTROLLER
---------------------------- */
let UIController = (function(){

    const DOMElements = {
        inputType: document.querySelector(".add__type"),
        inputDesc: document.querySelector(".add__description"),
        inputAmount: document.querySelector(".add__value"),
        addBtn: document.querySelector(".add__btn"),
        incomeList: document.querySelector(".income__list"),
        expensesList: document.querySelector(".expenses__list"),
        expensesValue: document.querySelector(".budget__expenses--value"),
        incomeValue: document.querySelector(".budget__income--value"),
        totalPercentage: document.querySelector(".budget__expenses--percentage"),
        budget: document.querySelector(".budget__value"),
    };

    return {
        getInput: function(){
            return {
                type: DOMElements.inputType.value,
                desc: DOMElements.inputDesc.value,
                amount: DOMElements.inputAmount.value,
            }     
        },
        getDOMElements: function(){
            return DOMElements;
        },
        clearInputs: function(){
             document.querySelectorAll(".add__description, .add__value").forEach(input =>  {
                    input.value = "";
                    DOMElements.inputDesc.focus();
                });
        },
        addListItem: function(obj, type) {
            let html;

            if(type === "inc") {
                html = `
                    <div class="item clearfix" id="income-${obj.id}">
                        <div class="item__description">${obj.desc}</div>
                        <div class="right clearfix">
                            <div class="item__value">+ ${obj.value}</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `;
                
                DOMElements.incomeList.insertAdjacentHTML("beforeend", html);
            } else {
                html = `
                    <div class="item clearfix" id="expense-${obj.id}">
                        <div class="item__description">${obj.desc}</div>
                        <div class="right clearfix">
                            <div class="item__value">- ${obj.value}</div>
                            <div class="item__percentage">21%</div>
                            <div class="item__delete">
                                <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                            </div>
                        </div>
                    </div>
                `;

                DOMElements.expensesList.insertAdjacentHTML("beforeend", html);
            }
        },
        updateBudgetScreens: function(budgets) {
            DOMElements.incomeValue.textContent = `+${budgets.totalInc}`;
            DOMElements.expensesValue.textContent = `-${budgets.totalExp}`;
            DOMElements.totalPercentage.textContent = `${budgets.percentage}%`;
            
            if(budgets.budget > 0) {
                DOMElements.budget.textContent = `+${budgets.budget}`
            } else {
                DOMElements.budget.textContent = `${budgets.budget}`
            }
        }
    }

})();


/*
APPCONTROLLER
---------------------------- */
let AppController = (function(budget, UI){

    const setupEventListeners = () => {
        const DOM = UI.getDOMElements();
        // Add new item on btn click
        DOM.addBtn.addEventListener("click", addNewItem);
        // Add new item on enter keypress
        document.addEventListener("keypress", (e) => {
            if (e.keyCode === 13 || e.which === 13) {
                addNewItem();
            }
        })
    }
    const updateBudget = () => {
        budget.calculateBudget();

        const budgetData = budget.getBudget();

        UI.updateBudgetScreens(budgetData);


    };

    const addNewItem = () => {
        const input = UI.getInput();
        // Check if inputs are not empty
        if (input.desc.trim() !== "" && input.amount.trim() !== "" && parseFloat(input.amount) > 0 ) {
            const newItem = budget.addItem(input.type, input.desc, parseFloat(input.amount));
    
            UI.clearInputs();
            UI.addListItem(newItem, input.type);
    
            updateBudget();
        } else {
            alert("Fields can't be left empty");
        }
    }



    return {
        init: function(){
            console.log("----------------------------")
            console.log("Application has started.")
            console.log("----------------------------")
            setupEventListeners();
        }
    }
})(budgetController, UIController);




// Initialize application
AppController.init();
