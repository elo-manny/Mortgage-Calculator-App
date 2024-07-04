class USER_Mortgage {
    // Display results to the user!
    static empty = document.querySelector(".empty");
    static completed = document.querySelector(".completed");

    static monthlyPayment = document.querySelector(".monthly-payment");
    static totalTermPayment = document.querySelector(".total-term-payment");

    static showResult(mortgageMonthlyPayment, mortgageTotalPayment) {
        USER_Mortgage.empty.classList.add("hidden");
        USER_Mortgage.completed.classList.remove("hidden");

        mortgageMonthlyPayment = mortgageMonthlyPayment.toFixed(2);
        mortgageTotalPayment = mortgageTotalPayment.toFixed(2);

        mortgageMonthlyPayment = parseFloat(mortgageMonthlyPayment).toLocaleString();
        mortgageTotalPayment = parseFloat(mortgageTotalPayment).toLocaleString();

        USER_Mortgage.monthlyPayment.innerText = `£${mortgageMonthlyPayment}`;
        USER_Mortgage.totalTermPayment.innerText = `£${mortgageTotalPayment}`;
    }
}




class MG_Calculator {
    // Calculate Mortgage 
    static calculateInterestOnlyMortgage(mortgageAmount, mortgageTerm, interestRate) {
        let interestOnly = ((interestRate / 100) * mortgageAmount) / 12;
        let totalPayment = interestOnly * (mortgageTerm * 12);
        return {
            interestOnly: interestOnly,
            totalPayment: totalPayment
        };
    }

    static calculateRepaymentMortgage(mortgageAmount, mortgageTerm, interestRate) {
        let annualInterestRate = interestRate / 100;
        let monthlyInterestRate = annualInterestRate / 12;
        mortgageTerm = mortgageTerm * 12;

        let calc1 = monthlyInterestRate * Math.pow(1 + monthlyInterestRate, mortgageTerm);
        let calc2 = Math.pow(1 + monthlyInterestRate, mortgageTerm) - 1;
        let repayment = mortgageAmount * (calc1 / calc2);
        let totalPayment = repayment * mortgageTerm;

        return {
            repayment: repayment,
            totalPayment: totalPayment
        };
    }

    static calculateMortgage(type, mortgageAmount, mortgageTerm, interestRate) {
        if (type === "Repayment") {
            const result = MG_Calculator.calculateRepaymentMortgage(mortgageAmount, mortgageTerm, interestRate);
            USER_Mortgage.showResult(result.repayment, result.totalPayment);
        } else {
            const result = MG_Calculator.calculateInterestOnlyMortgage(mortgageAmount, mortgageTerm, interestRate);
            USER_Mortgage.showResult(result.interestOnly, result.totalPayment);
        }
    }
}




class UI {
    static inputs = document.querySelectorAll("input[type='number']");
    static radioInputs = document.querySelectorAll("input[type='radio']");
    static calculateBtn = document.querySelector(".calculate-btn");
    static form = document.querySelector("form")
    static clearBtn = document.querySelector("#clearAll")

    static init() {
        UI.clearBtn.addEventListener("click", () => {
            UI.form.reset()
        })
        
        // which radio button was selected?
        let checkedRadio = null;

        UI.radioInputs.forEach(input => {
            input.addEventListener("change", ({ target }) => {
                if (target.id === "Repayment") {
                    checkedRadio = "Repayment";
                } else {
                    checkedRadio = "interestOnly";
                }
            });
        });

        // highlights selected radio button
        UI.radioInputs.forEach(input => {
            input.addEventListener("change", () => {
                UI.radioInputs.forEach(radio => {
                    radio.parentElement.parentElement.classList.toggle("active", radio.checked);
                });
            });
        });

        UI.calculateBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const isValidInputs = UI.validateInputs(UI.inputs, UI.radioInputs);
            if (isValidInputs) {
                const [mortgageAmount, mortgageTerm, interestRate] = Array.from(UI.inputs).map(input => parseFloat(input.value));
                MG_Calculator.calculateMortgage(checkedRadio, mortgageAmount, mortgageTerm, interestRate);
            }
        });
    }

    static validateInputs(inputs, radioInputs) {
        let valid = true;

        inputs.forEach(input => {
            if (input.value.trim() === "" || isNaN(parseFloat(input.value))) {
                UI.handleError(input, false, true);
                valid = false;
            } else {
                UI.handleError(input, true, true);
            }
        });

        if (!radioInputs[0].checked && !radioInputs[1].checked) {
            UI.handleError(null, false, false);
            valid = false;
        } else {
            UI.handleError(null, true, false);
        }

        return valid;
    }

    static handleError(input, valid, isNumberInput) {
        const errorMsg = document.querySelector(".radio-error-msg");

        if (isNumberInput) {
            if (valid) {
                input.classList.remove("error");
                const errorMsg = input.parentElement.nextElementSibling;
                errorMsg.classList.add("hidden");
            } else {
                input.classList.add("error");
                const errorMsg = input.parentElement.nextElementSibling;
                errorMsg.classList.remove("hidden");
            }
        } else {
            if (valid) {
                errorMsg.classList.add("hidden");
            } else {
                errorMsg.classList.remove("hidden");
            }
        }
    }
}

UI.init();