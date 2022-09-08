const initialState = {
    Products: [],
    CategoryAdd: [],
    Deposito: [],
    Expensecat: [],
    Expenses: [],
    Orders: [],
    Employee: [],
    NotifyMaster: [],
    DepositoLogin: true,
    Sales_Activity: [],
    // Status: false,
    Status: navigator.onLine,
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "PRODUCTS":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Products: action.item,
                };
            }
            return {
                ...state,
                Products: [...state.Products, action.item],
            };

        case "CATEGORYADD":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    CategoryAdd: action.item,
                };
            }
            return {
                ...state,
                CategoryAdd: [...state.CategoryAdd, action.item],
            };

        case "DEPOSITO":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Deposito: action.item,
                };
            }
            return {
                ...state,
                Deposito: [...state.Deposito, action.item],
            };

        case "EXPENSECAT":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Expensecat: action.item,
                };
            }
            return {
                ...state,
                Expensecat: [...state.Expensecat, action.item],
            };

        case "DEPOSITOLOGIN":
            return {
                ...state,
                DepositoLogin: action.item,
            };

        case "ORDERS":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Orders: action.item,
                };
            }
            return {
                ...state,
                Orders: [...state.Orders, action.item],
            };

        case "EMPLOYEE":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Employee: action.item,
                };
            }
            return {
                ...state,
                Employee: [...state.Employee, action.item],
            };

        case "EXPENSES":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Expenses: action.item,
                };
            }
            return {
                ...state,
                Expenses: [...state.Expenses, action.item],
            };

        case "NOTIFICATION":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    NotifyMaster: action.item,
                };
            }
            return {
                ...state,
                NotifyMaster: [...state.NotifyMaster, action.item],
            };

        case "SALESACTIVITY":
            if (Array.isArray(action.item)) {
                return {
                    ...state,
                    Sales_Activity: action.item,
                };
            }
            return {
                ...state,
                Sales_Activity: [...state.Sales_Activity, action.item],
            };

        default:
            return state;
    }
};

export default rootReducer;
