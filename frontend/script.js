// ============================================================
// CHURNIQ — CUSTOMER CHURN INTELLIGENCE
// Complete Frontend API Integration
// ============================================================

const API_BASE_URL = "";

const endpointLabel = document.getElementById("settingsApiEndpoint");
if (endpointLabel) {
    endpointLabel.textContent = window.location.origin;
}




   // ============================================================
// CHURNIQ — SECTION NAVIGATION
// SINGLE SOURCE OF TRUTH
// ============================================================

function navigateToSection(sectionId, clickedButton) {

    console.log("Navigating to:", sectionId);

    const dashboardSection =
        getElement("dashboardSection");

    const analyticsSection =
        getElement("analyticsSection");

    const settingsSection =
        getElement("settingsSection");

    const predictionSection =
        getElement("predictionSection");

    const customersSection =
        getElement("customersSection");


    // ========================================================
    // REMOVE ACTIVE NAV STATE
    // ========================================================

    document
        .querySelectorAll(".sidebar-nav .nav-item, .nav-item")
        .forEach(item => {
            item.classList.remove("active");
        });


    if (clickedButton) {
        clickedButton.classList.add("active");
    }


    // ========================================================
    // HIDE FULL-PAGE SECTIONS
    // ========================================================

    if (dashboardSection) {
        dashboardSection.style.display = "none";
        dashboardSection.classList.remove("active");
    }

    if (analyticsSection) {
        analyticsSection.style.display = "none";
        analyticsSection.classList.remove("active");
    }

    if (settingsSection) {
        settingsSection.style.display = "none";
        settingsSection.classList.remove("active");
    }


    // ========================================================
    // DASHBOARD
    // ========================================================

    if (sectionId === "dashboardSection") {

        if (dashboardSection) {

            dashboardSection.style.display = "block";
            dashboardSection.classList.add("active");

            loadDashboard();
            loadRiskCustomers();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        }

        return;
    }


    // ========================================================
    // ANALYTICS
    // ========================================================

    if (sectionId === "analyticsSection") {

        if (analyticsSection) {

            analyticsSection.style.display = "block";
            analyticsSection.classList.add("active");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            // Load analytics AFTER section is visible
            requestAnimationFrame(() => {
                loadAnalytics();
            });

        }

        return;
    }


    // ========================================================
    // SETTINGS
    // ========================================================

    if (sectionId === "settingsSection") {

        if (settingsSection) {

            settingsSection.style.display = "block";
            settingsSection.classList.add("active");

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

            checkAPIStatus();

        }

        return;
    }


    // ========================================================
    // PREDICTION
    // ========================================================

    if (sectionId === "predictionSection") {

        if (dashboardSection) {

            dashboardSection.style.display = "block";
            dashboardSection.classList.add("active");

        }

        if (predictionSection) {

            setTimeout(() => {

                predictionSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 50);

        }

        return;
    }


    // ========================================================
    // CUSTOMERS
    // ========================================================

    if (sectionId === "customersSection") {

        if (dashboardSection) {

            dashboardSection.style.display = "block";
            dashboardSection.classList.add("active");

        }

        if (customersSection) {

            setTimeout(() => {

                customersSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }, 50);

        }

        loadRiskCustomers();

        return;
    }

}
// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}


function setText(id, value) {
    const element = getElement(id);

    if (element) {
        element.textContent = value;
    }
}


function getNumber(value, fallback = null) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


// ============================================================
// LOAD DASHBOARD SUMMARY
// ============================================================

async function loadDashboard() {

    console.log("Loading dashboard summary...");

    try {

        const response = await fetch(
            `${API_BASE_URL}/dashboard/summary`
        );

        console.log(
            "Dashboard HTTP status:",
            response.status
        );

        if (!response.ok) {

            throw new Error(
                `Dashboard request failed: ${response.status}`
            );

        }

        const data = await response.json();

        console.log(
            "Dashboard API response:",
            data
        );

        updateDashboard(data);

    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

    }
}


// ============================================================
// UPDATE DASHBOARD
// ============================================================

function updateDashboard(data) {

    console.log(
        "Dashboard data received:",
        data
    );


    // --------------------------------------------------------
    // KPI CARDS
    // --------------------------------------------------------

    const cards =
        document.querySelectorAll(".card-value");


    // TOTAL CUSTOMERS

    if (
        cards[0] &&
        data.total_customers !== undefined
    ) {

        cards[0].textContent =
            Number(
                data.total_customers
            ).toLocaleString();

    }


    // CHURNED CUSTOMERS

    if (
        cards[1] &&
        data.churned_customers !== undefined
    ) {

        cards[1].textContent =
            Number(
                data.churned_customers
            ).toLocaleString();

    }


    // CHURN RATE

    if (
        cards[2] &&
        data.churn_rate !== undefined
    ) {

        cards[2].textContent =
            `${Number(
                data.churn_rate
            ).toFixed(2)}%`;

    }


    // ACTIVE CUSTOMERS

    if (
        cards[3] &&
        data.active_customers !== undefined
    ) {

        cards[3].textContent =
            Number(
                data.active_customers
            ).toLocaleString();

    }


    // --------------------------------------------------------
    // ACTIVE PERCENTAGE
    // --------------------------------------------------------

    const totalCustomers =
        getNumber(
            data.total_customers
        );

    const activeCustomers =
        getNumber(
            data.active_customers
        );

    const churnedCustomers =
        getNumber(
            data.churned_customers
        );


    if (
        totalCustomers !== null &&
        activeCustomers !== null &&
        totalCustomers > 0
    ) {

        const activeRate =
            (
                activeCustomers /
                totalCustomers
            ) * 100;


        setText(
            "activePercentage",
            `${activeRate.toFixed(2)}%`
        );


        const activeProgress =
            document.querySelector(
                ".churn-no"
            );


        if (activeProgress) {

            activeProgress.style.width =
                `${activeRate}%`;

        }


        setText(
            "activeMetric",
            activeCustomers.toLocaleString()
        );

    }


    // --------------------------------------------------------
    // CHURNED PERCENTAGE
    // --------------------------------------------------------

    let churnRate =
        getNumber(
            data.churn_rate
        );


    if (
        churnRate === null &&
        totalCustomers !== null &&
        churnedCustomers !== null &&
        totalCustomers > 0
    ) {

        churnRate =
            (
                churnedCustomers /
                totalCustomers
            ) * 100;

    }


    if (churnRate !== null) {

        setText(
            "churnedPercentage",
            `${churnRate.toFixed(2)}%`
        );


        const churnProgress =
            document.querySelector(
                ".churn-yes"
            );


        if (churnProgress) {

            churnProgress.style.width =
                `${churnRate}%`;

        }


        setText(
            "churnedMetric",
            churnedCustomers !== null
                ? churnedCustomers.toLocaleString()
                : "--"
        );

    }


    // --------------------------------------------------------
    // AVERAGE MONTHLY CHARGES
    // --------------------------------------------------------

    const averageMonthlyCharges =
        getNumber(
            data.average_monthly_charges ??
            data.avg_monthly_charges ??
            data.averageMonthlyCharges
        );


    if (averageMonthlyCharges !== null) {

        setText(
            "avgMonthlyCharges",
            `$${averageMonthlyCharges.toFixed(2)}`
        );

    }


    // --------------------------------------------------------
    // AVERAGE TENURE
    // --------------------------------------------------------

    const averageTenure =
        getNumber(
            data.average_tenure ??
            data.avg_tenure ??
            data.averageTenure
        );


    if (averageTenure !== null) {

        setText(
            "avgTenure",
            `${averageTenure.toFixed(2)} months`
        );

    }


    console.log(
        "Dashboard UI updated successfully."
    );
}


// ============================================================
// LOAD HIGH-RISK CUSTOMERS
// ============================================================

async function loadRiskCustomers() {

    console.log(
        "Loading risk customers..."
    );


    const table =
        getElement(
            "riskCustomersTable"
        );


    if (!table) {

        console.error(
            "ERROR: #riskCustomersTable was not found."
        );

        return;

    }


    // Show loading state

    table.innerHTML = `
        <tr>
            <td colspan="4" class="table-loading">
                Loading high-risk customers...
            </td>
        </tr>
    `;


    try {

        const response = await fetch(
            `${API_BASE_URL}/dashboard/risk-customers`
        );


        console.log(
            "Risk customers HTTP status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                `Risk customer request failed: ${response.status}`
            );

        }


        const result =
            await response.json();


        console.log(
            "Risk customers API response:",
            result
        );


        // ----------------------------------------------------
        // SUPPORT DIFFERENT API RESPONSE STRUCTURES
        // ----------------------------------------------------

        let customers = [];


        if (Array.isArray(result)) {

            customers = result;

        }

        else if (
            result &&
            Array.isArray(result.customers)
        ) {

            customers = result.customers;

        }

        else if (
            result &&
            Array.isArray(result.risk_customers)
        ) {

            customers =
                result.risk_customers;

        }

        else if (
            result &&
            Array.isArray(result.data)
        ) {

            customers =
                result.data;

        }


        console.log(
            "Processed risk customers:",
            customers
        );


        // ----------------------------------------------------
        // NO CUSTOMERS
        // ----------------------------------------------------

        if (
            customers.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="4"
                        class="empty-table"
                    >
                        No high-risk customers found.
                    </td>
                </tr>
            `;

            return;

        }


        // ----------------------------------------------------
        // BUILD TABLE
        // ----------------------------------------------------

        table.innerHTML = "";


        customers
            .slice(0, 10)
            .forEach(
                (customer) => {

                    const customerID =
                        customer.customerID ??
                        customer.customer_id ??
                        customer.CustomerID ??
                        "Unknown";


                    let rawProbability =
                        customer.churn_probability ??
                        customer.churnProbability ??
                        customer.probability ??
                        0;


                    let probability =
                        Number(
                            rawProbability
                        );


                    if (
                        probability <= 1
                    ) {

                        probability =
                            probability * 100;

                    }


                    const probabilityText =
                        probability.toFixed(2);


                    const riskLevel =
                        String(
                            customer.risk_level ??
                            customer.riskLevel ??
                            "Unknown"
                        );


                    const retentionAction =
                        customer.retention_action ??
                        customer.retentionAction ??
                        "Review customer";


                    const riskClass =
                        riskLevel
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                "-"
                            );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            <strong class="customer-id">
                                ${customerID}
                            </strong>
                        </td>

                        <td>
                            <strong class="probability">
                                ${probabilityText}%
                            </strong>
                        </td>

                        <td>
                            <span
                                class="risk-badge risk-${riskClass}"
                            >
                                ${riskLevel.toUpperCase()}
                            </span>
                        </td>

                        <td class="risk-action">
                            ${retentionAction}
                        </td>

                    `;


                    table.appendChild(
                        row
                    );

                }
            );


        console.log(
            "Risk customer table updated successfully."
        );


    } catch (error) {

        console.error(
            "Risk customer loading error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-table"
                >
                    Unable to load high-risk customers.
                </td>
            </tr>
        `;

    }
}


// ============================================================
// COLLECT CUSTOMER FORM DATA
// ============================================================

function collectCustomerData() {

    const customerID =
        getElement(
            "customerSearch"
        )?.value.trim();


    const gender =
        getElement(
            "gender"
        )?.value;


    const seniorCitizen =
        getElement(
            "SeniorCitizen"
        )?.value;


    const partner =
        getElement(
            "Partner"
        )?.value;


    const dependents =
        getElement(
            "Dependents"
        )?.value;


    const tenure =
        getElement(
            "tenure"
        )?.value;


    const phoneService =
        getElement(
            "PhoneService"
        )?.value;


    const multipleLines =
        getElement(
            "MultipleLines"
        )?.value;


    const internetService =
        getElement(
            "InternetService"
        )?.value;


    const onlineSecurity =
        getElement(
            "OnlineSecurity"
        )?.value;


    const onlineBackup =
        getElement(
            "OnlineBackup"
        )?.value;


    const deviceProtection =
        getElement(
            "DeviceProtection"
        )?.value;


    const techSupport =
        getElement(
            "TechSupport"
        )?.value;


    const streamingTV =
        getElement(
            "StreamingTV"
        )?.value;


    const streamingMovies =
        getElement(
            "StreamingMovies"
        )?.value;


    const contract =
        getElement(
            "Contract"
        )?.value;


    const paperlessBilling =
        getElement(
            "PaperlessBilling"
        )?.value;


    const paymentMethod =
        getElement(
            "PaymentMethod"
        )?.value;


    const monthlyCharges =
        getElement(
            "MonthlyCharges"
        )?.value;


    const totalCharges =
        getElement(
            "TotalCharges"
        )?.value;


    return {

        customerID,

        gender,

        SeniorCitizen:
            Number(
                seniorCitizen
            ),

        Partner:
            partner,

        Dependents:
            dependents,

        tenure:
            Number(
                tenure
            ),

        PhoneService:
            phoneService,

        MultipleLines:
            multipleLines,

        InternetService:
            internetService,

        OnlineSecurity:
            onlineSecurity,

        OnlineBackup:
            onlineBackup,

        DeviceProtection:
            deviceProtection,

        TechSupport:
            techSupport,

        StreamingTV:
            streamingTV,

        StreamingMovies:
            streamingMovies,

        Contract:
            contract,

        PaperlessBilling:
            paperlessBilling,

        PaymentMethod:
            paymentMethod,

        MonthlyCharges:
            Number(
                monthlyCharges
            ),

        TotalCharges:
            Number(
                totalCharges
            )

    };
}


// ============================================================
// VALIDATE CUSTOMER FORM
// ============================================================

function validateCustomerData(data) {

    const requiredFields = [

        ["customerID", "Customer ID"],
        ["gender", "Gender"],
        ["SeniorCitizen", "Senior Citizen"],
        ["Partner", "Partner"],
        ["Dependents", "Dependents"],
        ["tenure", "Tenure"],
        ["PhoneService", "Phone Service"],
        ["MultipleLines", "Multiple Lines"],
        ["InternetService", "Internet Service"],
        ["OnlineSecurity", "Online Security"],
        ["OnlineBackup", "Online Backup"],
        ["DeviceProtection", "Device Protection"],
        ["TechSupport", "Tech Support"],
        ["StreamingTV", "Streaming TV"],
        ["StreamingMovies", "Streaming Movies"],
        ["Contract", "Contract"],
        ["PaperlessBilling", "Paperless Billing"],
        ["PaymentMethod", "Payment Method"],
        ["MonthlyCharges", "Monthly Charges"],
        ["TotalCharges", "Total Charges"]

    ];


    for (
        const [
            field,
            label
        ] of requiredFields
    ) {

        const value =
            data[field];


        if (
            value === "" ||
            value === null ||
            value === undefined ||
            (
                typeof value === "number" &&
                Number.isNaN(value)
            )
        ) {

            alert(
                `Please enter/select ${label}.`
            );


            const element =
                getElement(
                    field === "customerID"
                        ? "customerSearch"
                        : field
                );


            if (element) {

                element.focus();

            }


            return false;

        }

    }


    return true;
}


// ============================================================
// SHOW PREDICTION LOADING STATE
// ============================================================

function showPredictionLoading() {

    const placeholder =
        getElement(
            "predictionPlaceholder"
        );


    const predictionData =
        getElement(
            "predictionData"
        );


    if (placeholder) {

        placeholder.style.display =
            "none";

    }


    if (predictionData) {

        predictionData.style.display =
            "block";

    }


    setText(
        "riskLevel",
        "ANALYZING..."
    );


    setText(
        "churnProbability",
        "Loading..."
    );


    setText(
        "recommendation",
        "Running the churn prediction model..."
    );

}


// ============================================================
// SHOW PREDICTION RESULT
// ============================================================

function showPredictionResult(data) {

    console.log(
        "Displaying prediction:",
        data
    );


    const placeholder =
        getElement(
            "predictionPlaceholder"
        );


    const predictionData =
        getElement(
            "predictionData"
        );


    if (placeholder) {

        placeholder.style.display =
            "none";

    }


    if (predictionData) {

        predictionData.style.display =
            "block";

    }


    const riskLevel =
        data.risk_level ??
        data.riskLevel ??
        data.prediction ??
        "Unknown";


    let probability =
        data.churn_probability ??
        data.churnProbability ??
        data.probability;


    probability =
        Number(
            probability
        );


    if (
        Number.isFinite(probability) &&
        probability <= 1
    ) {

        probability =
            probability * 100;

    }


    const retentionAction =
        data.retention_action ??
        data.retentionAction ??
        data.recommendation ??
        "No retention recommendation available.";


    setText(
        "riskLevel",
        String(
            riskLevel
        ).toUpperCase()
    );


    if (
        Number.isFinite(probability)
    ) {

        setText(
            "churnProbability",
            `${probability.toFixed(1)}%`
        );

    }

    else {

        setText(
            "churnProbability",
            "--"
        );

    }


    setText(
        "recommendation",
        retentionAction
    );


    const riskElement =
        getElement(
            "riskLevel"
        );


    if (riskElement) {

        riskElement.classList.remove(
            "risk-low",
            "risk-medium",
            "risk-high",
            "risk-critical"
        );


        const riskClass =
            String(
                riskLevel
            )
                .toLowerCase()
                .replace(
                    /\s+/g,
                    "-"
                );


        riskElement.classList.add(
            `risk-${riskClass}`
        );

    }


    console.log(
        "Prediction displayed successfully."
    );

}


// ============================================================
// CUSTOMER ANALYSIS / PREDICTION
// ============================================================

async function analyzeCustomer() {

    console.log(
        "Starting customer churn prediction..."
    );


    const customerData =
        collectCustomerData();


    console.log(
        "Customer data being sent to FastAPI:",
        customerData
    );


    if (
        !validateCustomerData(
            customerData
        )
    ) {

        console.warn(
            "Customer form validation failed."
        );

        return;

    }


    const button =
        getElement(
            "predictionButton"
        );


    const originalButtonText =
        button
            ? button.innerHTML
            : null;


    if (button) {

        button.disabled = true;


        button.innerHTML = `
            <span class="button-spinner"></span>
            Analyzing Customer...
        `;

    }


    showPredictionLoading();


    try {

        console.log(
            "Sending POST request to:",
            `${API_BASE_URL}/predict/`
        );


        const response =
            await fetch(
                `${API_BASE_URL}/predict/`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Accept":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            customerData
                        )

                }
            );


        console.log(
            "Prediction HTTP status:",
            response.status
        );


        const responseText =
            await response.text();


        console.log(
            "Raw prediction response:",
            responseText
        );


        let data;


        try {

            data =
                JSON.parse(
                    responseText
                );

        }

        catch (jsonError) {

            throw new Error(
                `FastAPI returned invalid JSON: ${responseText}`
            );

        }


        console.log(
            "Prediction API response:",
            data
        );


        if (!response.ok) {

            throw new Error(
                data.detail ??
                data.message ??
                `Prediction failed with status ${response.status}`
            );

        }


        showPredictionResult(
            data
        );


    }

    catch (error) {

        console.error(
            "Prediction error:",
            error
        );


        const placeholder =
            getElement(
                "predictionPlaceholder"
            );


        const predictionData =
            getElement(
                "predictionData"
            );


        if (placeholder) {

            placeholder.style.display =
                "none";

        }


        if (predictionData) {

            predictionData.style.display =
                "block";

        }


        setText(
            "riskLevel",
            "ERROR"
        );


        setText(
            "churnProbability",
            "--"
        );


        setText(
            "recommendation",
            `Prediction service error: ${error.message}`
        );

    }

    finally {

        if (button) {

            button.disabled = false;


            if (
                originalButtonText
            ) {

                button.innerHTML =
                    originalButtonText;

            }

        }

    }

}


// ============================================================
// RUN PREDICTION BUTTON
// ============================================================

function runPrediction() {

    console.log(
        "Run Prediction button clicked."
    );

    analyzeCustomer();

}


// ============================================================
// INITIALIZE NAVIGATION
// ============================================================

function initializeNavigation() {

    const navItems = document.querySelectorAll(
        ".nav-item"
    );

    navItems.forEach((item) => {

        item.addEventListener("click", () => {

            const sectionId =
                item.getAttribute("data-section");

            if (!sectionId) {
                console.warn(
                    "Navigation item has no data-section:",
                    item
                );
                return;
            }

            navigateToSection(
                sectionId,
                item
            );

        });

    });


    const defaultSection =
        document.getElementById(
            "dashboardSection"
        );

    if (defaultSection) {
        defaultSection.classList.add("active");
    }

}


// ============================================================
// CHURNIQ — INITIALIZE APPLICATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "===================================="
        );

        console.log(
            "ChurnIQ frontend loaded."
        );

        console.log(
            "API:",
            API_BASE_URL
        );

        console.log(
            "===================================="
        );


        // ====================================================
        // INITIAL DATA
        // ====================================================

        loadDashboard();

        loadRiskCustomers();


        // ====================================================
        // SIDEBAR NAVIGATION
        // ====================================================

        const navItems =
            document.querySelectorAll(
                ".nav-item"
            );


        navItems.forEach(item => {

            item.addEventListener(
                "click",
                () => {

                    const sectionId =
                        item.getAttribute(
                            "data-section"
                        );


                    if (!sectionId) {

                        console.warn(
                            "Navigation item has no data-section:",
                            item
                        );

                        return;

                    }


                    console.log(
                        "Sidebar item clicked:",
                        sectionId
                    );


                    navigateToSection(
                        sectionId,
                        item
                    );

                }
            );

        });


        // ====================================================
        // DEFAULT SECTION
        // ====================================================

        const dashboardSection =
            getElement(
                "dashboardSection"
            );


        if (dashboardSection) {

            dashboardSection.style.display =
                "block";

            dashboardSection.classList.add(
                "active"
            );

        }

    }
);


// ============================================================
// SIDEBAR NAVIGATION
// ============================================================

function navigateToSection(
    sectionId,
    clickedButton
) {

    console.log(
        "Navigating to:",
        sectionId
    );


    // --------------------------------------------------------
    // REMOVE ACTIVE FROM ALL SIDEBAR BUTTONS
    // --------------------------------------------------------

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        (item) => {

            item.classList.remove(
                "active"
            );

        }
    );


    // --------------------------------------------------------
    // ACTIVATE CLICKED BUTTON
    // --------------------------------------------------------

    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    }


    // --------------------------------------------------------
    // FIND SECTION
    // --------------------------------------------------------

    const section =
        document.getElementById(
            sectionId
        );


    if (!section) {

        console.warn(
            `Section not found: ${sectionId}`
        );

        return;

    }


    // --------------------------------------------------------
    // SCROLL TO SECTION
    // --------------------------------------------------------

    section.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });


    // --------------------------------------------------------
    // SPECIAL ACTIONS
    // --------------------------------------------------------

    if (
        sectionId === "customersSection"
    ) {

        loadRiskCustomers();

    }


    if (
        sectionId === "dashboardSection"
    ) {

        loadDashboard();

    }


    if (
        sectionId === "settingsSection"
    ) {

        checkAPIStatus();

    }


    // ========================================================
    // ANALYTICS
    // ONLY FIX APPLIED HERE
    // ========================================================

    if (
        sectionId === "analyticsSection"
    ) {

        loadAnalytics();

    }

}


// ============================================================
// CHECK API STATUS
// ============================================================

async function checkAPIStatus() {

    const status =
        getElement(
            "settingsApiStatus"
        );


    if (!status) {

        return;

    }


    status.textContent =
        "Checking...";


    status.className =
        "setting-status";


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/dashboard/summary`
            );


        if (
            response.ok
        ) {

            status.textContent =
                "Online";

            status.className =
                "setting-status online";

        }

        else {

            throw new Error(
                "API unavailable"
            );

        }

    }

    catch (error) {

        console.error(
            "API status check failed:",
            error
        );


        status.textContent =
            "Offline";

        status.className =
            "setting-status offline";

    }

}


// ============================================================
// REFRESH FROM SETTINGS
// ============================================================

function refreshDashboardFromSettings() {

    console.log(
        "Refreshing dashboard from Settings..."
    );


    loadDashboard();

    loadRiskCustomers();

    checkAPIStatus();

}


// ============================================================
// CLEAR PREDICTION
// ============================================================

function clearPrediction() {

    console.log(
        "Clearing prediction result..."
    );


    const placeholder =
        getElement(
            "predictionPlaceholder"
        );


    const predictionData =
        getElement(
            "predictionData"
        );


    if (predictionData) {

        predictionData.style.display =
            "none";

    }


    if (placeholder) {

        placeholder.style.display =
            "flex";

    }


    setText(
        "riskLevel",
        "--"
    );


    setText(
        "churnProbability",
        "--"
    );


    setText(
        "recommendation",
        "--"
    );


    const customerSearch =
        getElement(
            "customerSearch"
        );


    if (customerSearch) {

        customerSearch.value =
            "";

    }

}
// ============================================================
// CHURNIQ — ANALYTICS
// ENTERPRISE BUSINESS INTELLIGENCE
// REPLACE ONLY loadAnalytics()
// ============================================================

async function loadAnalytics() {

    console.log("====================================");
    console.log("Loading ChurnIQ Analytics...");
    console.log("====================================");


    // ========================================================
    // ANALYTICS KPI ELEMENTS
    // ========================================================

    const revenueExposureElement =
        getElement("analyticsRevenueExposure");

    const riskCountElement =
        getElement("analyticsRiskCustomers");

    const revenueShareElement =
        getElement("analyticsRevenueShare");

    const avgRiskRevenueElement =
        getElement("analyticsAvgRiskRevenue");


    // ========================================================
    // FINANCIAL EXPOSURE ELEMENTS
    // ========================================================

    const revenueExposureDisplay =
        getElement("revenueExposureDisplay");

    const revenueRiskCustomers =
        getElement("revenueRiskCustomers");

    const revenueShareAtRisk =
        getElement("revenueShareAtRisk");

    const avgRiskRevenue =
        getElement("avgRiskRevenue");

    const revenueRadarFill =
        getElement("revenueRadarFill");
const financialGaugeFill =
    getElement("financialGaugeFill");

const financialGaugePercentage =
    getElement("financialGaugePercentage");

const revenueProtected =
    getElement("revenueProtected");

const exposureLevel =
    getElement("exposureLevel");

const exposureBarFill =
    getElement("exposureBarFill");
    const revenueRadarPercentage =
        getElement("revenueRadarPercentage");

    const revenueExposureInsight =
        getElement("revenueExposureInsight");


    // ========================================================
    // PRIORITY MATRIX
    // ========================================================

    const priorityPointsElement =
        getElement("priorityMatrixPoints");

    const priorityOpportunityCountElement =
        getElement("priorityOpportunityCount");

    const priorityRecommendationElement =
        getElement("priorityRecommendation");


    // ========================================================
    // PRIORITY SUMMARY
    // ========================================================

    const analyticsPriorityCustomers =
        getElement("analyticsPriorityCustomers");

    const analyticsPriorityRevenue =
        getElement("analyticsPriorityRevenue");

    const analyticsPriorityFocus =
        getElement("analyticsPriorityFocus");


    // ========================================================
    // STATUS ELEMENTS
    // ========================================================

    const analyticsDatasetStatus =
        getElement("analyticsDatasetStatus");

    const analyticsRiskStatus =
        getElement("analyticsRiskStatus");

    const analyticsRevenueStatus =
        getElement("analyticsRevenueStatus");

    const analyticsPriorityStatus =
        getElement("analyticsPriorityStatus");


    // ========================================================
    // NUMBER HELPER
    // ========================================================

    function number(value, fallback = 0) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }

        const parsed =
            Number(
                String(value)
                    .replace(/[$,%\s,]/g, "")
            );

        return Number.isFinite(parsed)
            ? parsed
            : fallback;
    }


    // ========================================================
    // CURRENCY HELPER
    // ========================================================

    function currency(value) {

        return `$${number(value).toLocaleString(
            "en-US",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;

    }


    // ========================================================
    // EXTRACT CUSTOMER ARRAY
    // ========================================================

    function extractCustomers(result) {

        if (Array.isArray(result)) {
            return result;
        }

        if (
            result &&
            Array.isArray(result.customers)
        ) {
            return result.customers;
        }

        if (
            result &&
            Array.isArray(result.risk_customers)
        ) {
            return result.risk_customers;
        }

        if (
            result &&
            Array.isArray(result.data)
        ) {
            return result.data;
        }

        return [];

    }


    // ========================================================
    // GET CUSTOMER REVENUE
    // ========================================================

    function getRevenue(customer) {

        return number(

            customer.MonthlyCharges ??
            customer.monthlyCharges ??
            customer.monthly_charges ??
            customer.MonthlyCharge ??
            customer.monthlyCharge ??
            customer.monthly_revenue ??
            customer.monthlyRevenue ??
            customer.revenue ??
            0

        );

    }


    // ========================================================
    // GET CHURN PROBABILITY
    // ========================================================

    function getProbability(customer) {

        let value =

            customer.churn_probability ??
            customer.churnProbability ??
            customer.probability ??
            customer.ChurnProbability ??
            customer.prediction_probability ??
            customer.predictionProbability ??
            customer.churn_score ??
            customer.churnScore;


        if (
            value !== undefined &&
            value !== null &&
            value !== ""
        ) {

            let probability =
                number(value, NaN);


            if (
                Number.isFinite(probability)
            ) {

                if (
                    probability <= 1
                ) {

                    probability *= 100;

                }


                return Math.max(
                    0,
                    Math.min(
                        probability,
                        100
                    )
                );

            }

        }


        const risk =
            String(

                customer.risk_level ??
                customer.riskLevel ??
                customer.RiskLevel ??
                customer.risk ??
                ""

            ).toLowerCase();


        if (risk.includes("critical")) {
            return 90;
        }

        if (risk.includes("high")) {
            return 75;
        }

        if (risk.includes("medium")) {
            return 50;
        }

        if (risk.includes("low")) {
            return 20;
        }


        return 0;

    }


    // ========================================================
    // LOADING STATE
    // ========================================================

    if (revenueExposureElement) {
        revenueExposureElement.textContent = "Loading...";
    }

    if (riskCountElement) {
        riskCountElement.textContent = "--";
    }

    if (revenueShareElement) {
        revenueShareElement.textContent = "--";
    }

    if (avgRiskRevenueElement) {
        avgRiskRevenueElement.textContent = "--";
    }


    if (revenueExposureDisplay) {
        revenueExposureDisplay.textContent = "--";
    }

    if (revenueRiskCustomers) {
        revenueRiskCustomers.textContent = "--";
    }

    if (revenueShareAtRisk) {
        revenueShareAtRisk.textContent = "--";
    }

    if (avgRiskRevenue) {
        avgRiskRevenue.textContent = "--";
    }


    if (revenueRadarPercentage) {
        revenueRadarPercentage.textContent = "0%";
    }

    if (revenueRadarFill) {
        revenueRadarFill.style.width = "0%";
    }


    if (revenueExposureInsight) {
        revenueExposureInsight.textContent =
            "Loading financial intelligence...";
    }


    if (priorityOpportunityCountElement) {
        priorityOpportunityCountElement.textContent =
            "Loading...";
    }


    if (priorityRecommendationElement) {
        priorityRecommendationElement.textContent =
            "Loading retention intelligence...";
    }


    try {

        // ====================================================
        // FETCH LIVE API DATA
        // ====================================================

        const [
            summaryResponse,
            riskResponse
        ] = await Promise.all([

            fetch(
                `${API_BASE_URL}/dashboard/summary`
            ),

            fetch(
                `${API_BASE_URL}/dashboard/risk-customers`
            )

        ]);


        console.log(
            "Analytics summary HTTP status:",
            summaryResponse.status
        );

        console.log(
            "Analytics risk HTTP status:",
            riskResponse.status
        );


        if (!summaryResponse.ok) {

            throw new Error(
                `Dashboard summary failed: ${summaryResponse.status}`
            );

        }


        if (!riskResponse.ok) {

            throw new Error(
                `Risk customers failed: ${riskResponse.status}`
            );

        }


        const summary =
            await summaryResponse.json();

        const riskResult =
            await riskResponse.json();


        console.log(
            "Analytics Summary:",
            summary
        );

        console.log(
            "Analytics Risk Response:",
            riskResult
        );


        // ====================================================
        // CUSTOMER DATA
        // ====================================================

        const customers =
            extractCustomers(
                riskResult
            );


        console.log(
            "Analytics customer records:",
            customers.length
        );


        const analyticsCustomers =
            customers.map(
                customer => ({

                    customer,

                    revenue:
                        getRevenue(customer),

                    probability:
                        getProbability(customer)

                })
            );


        // ====================================================
        // BASIC SUMMARY
        // ====================================================

        const totalCustomers =
            number(
                summary.total_customers ??
                summary.totalCustomers
            );


        const churnedCustomers =
            number(
                summary.churned_customers ??
                summary.churnedCustomers
            );


        const activeCustomers =
            number(
                summary.active_customers ??
                summary.activeCustomers
            );


        // ====================================================
        // TOTAL MONTHLY REVENUE
        // ====================================================

        let totalMonthlyRevenue =
            number(

                summary.total_monthly_revenue ??
                summary.totalMonthlyRevenue ??
                summary.total_revenue ??
                summary.totalRevenue ??
                summary.monthly_revenue ??
                summary.monthlyRevenue

            );


        // ====================================================
        // HIGH-RISK CUSTOMER COUNT
        // ====================================================

        let highRiskCount =
            number(

                summary.high_risk_customers ??
                summary.highRiskCustomers ??
                summary.risk_customers ??
                summary.riskCustomers ??
                summary.high_risk_count ??
                summary.highRiskCount ??
                riskResult.high_risk_customers ??
                riskResult.highRiskCustomers ??
                riskResult.total_high_risk_customers ??
                riskResult.totalHighRiskCustomers ??
                riskResult.high_risk_count ??
                riskResult.highRiskCount

            );


        // ====================================================
        // REVENUE EXPOSURE
        // ====================================================

        let revenueExposure =
            number(

                summary.revenue_exposure ??
                summary.revenueExposure ??
                summary.monthly_revenue_exposure ??
                summary.monthlyRevenueExposure ??
                summary.high_risk_revenue ??
                summary.highRiskRevenue ??
                summary.risk_revenue ??
                summary.riskRevenue ??
                riskResult.revenue_exposure ??
                riskResult.revenueExposure ??
                riskResult.monthly_revenue_exposure ??
                riskResult.monthlyRevenueExposure ??
                riskResult.high_risk_revenue ??
                riskResult.highRiskRevenue ??
                riskResult.risk_revenue ??
                riskResult.riskRevenue

            );


        // ====================================================
        // REVENUE SHARE
        // ====================================================

        let revenueShare =
            number(

                summary.revenue_share_at_risk ??
                summary.revenueShareAtRisk ??
                summary.revenue_share ??
                summary.revenueShare ??
                summary.risk_revenue_share ??
                summary.riskRevenueShare ??
                riskResult.revenue_share_at_risk ??
                riskResult.revenueShareAtRisk ??
                riskResult.revenue_share ??
                riskResult.revenueShare

            );


        // ====================================================
        // AVERAGE RISK REVENUE
        // ====================================================

        let averageRiskRevenue =
            number(

                summary.avg_risk_customer_revenue ??
                summary.average_risk_customer_revenue ??
                summary.avgRiskCustomerRevenue ??
                summary.averageRiskCustomerRevenue ??
                summary.average_revenue_risk_customer ??
                summary.averageRevenueRiskCustomer ??
                riskResult.avg_risk_customer_revenue ??
                riskResult.average_risk_customer_revenue ??
                riskResult.avgRiskCustomerRevenue ??
                riskResult.averageRiskCustomerRevenue

            );


        // ====================================================
        // PRIORITY CUSTOMER COUNT
        // ====================================================

        let priorityCount =
            number(

                summary.priority_customers ??
                summary.priorityCustomers ??
                summary.high_value_high_risk_customers ??
                summary.highValueHighRiskCustomers ??
                summary.priority_customer_count ??
                summary.priorityCustomerCount ??
                riskResult.priority_customers ??
                riskResult.priorityCustomers ??
                riskResult.high_value_high_risk_customers ??
                riskResult.highValueHighRiskCustomers ??
                riskResult.priority_customer_count ??
                riskResult.priorityCustomerCount

            );


        // ====================================================
        // PRIORITY REVENUE
        // ====================================================

        let priorityRevenue =
            number(

                summary.priority_revenue ??
                summary.priorityRevenue ??
                summary.high_value_high_risk_revenue ??
                summary.highValueHighRiskRevenue ??
                summary.priority_revenue_exposure ??
                summary.priorityRevenueExposure ??
                riskResult.priority_revenue ??
                riskResult.priorityRevenue ??
                riskResult.high_value_high_risk_revenue ??
                riskResult.highValueHighRiskRevenue ??
                riskResult.priority_revenue_exposure ??
                riskResult.priorityRevenueExposure

            );


        // ====================================================
        // FALLBACK CALCULATIONS
        // ONLY USED WHEN BACKEND DOES NOT PROVIDE VALUES
        // ====================================================

        if (
            highRiskCount <= 0 &&
            analyticsCustomers.length > 0
        ) {

            highRiskCount =
                analyticsCustomers.filter(
                    item =>
                        item.probability >= 50
                ).length;

        }


        if (
            revenueExposure <= 0 &&
            analyticsCustomers.length > 0
        ) {

            revenueExposure =
                analyticsCustomers
                    .filter(
                        item =>
                            item.probability >= 50
                    )
                    .reduce(
                        (total, item) =>
                            total + item.revenue,
                        0
                    );

        }


        if (
            averageRiskRevenue <= 0 &&
            highRiskCount > 0 &&
            revenueExposure > 0
        ) {

            averageRiskRevenue =
                revenueExposure /
                highRiskCount;

        }


        if (
            totalMonthlyRevenue <= 0 &&
            analyticsCustomers.length > 0
        ) {

            totalMonthlyRevenue =
                analyticsCustomers.reduce(
                    (total, item) =>
                        total + item.revenue,
                    0
                );

        }


        if (
            revenueShare <= 0 &&
            totalMonthlyRevenue > 0 &&
            revenueExposure > 0
        ) {

            revenueShare =
                (
                    revenueExposure /
                    totalMonthlyRevenue
                ) * 100;

        }


        // ====================================================
        // PRIORITY FALLBACK
        // ====================================================

        if (
            priorityCount <= 0 &&
            analyticsCustomers.length > 0
        ) {

            const revenueValues =
                analyticsCustomers
                    .map(
                        item =>
                            item.revenue
                    )
                    .filter(
                        value =>
                            value > 0
                    )
                    .sort(
                        (a, b) =>
                            a - b
                    );


            let medianRevenue = 0;


            if (
                revenueValues.length > 0
            ) {

                const middle =
                    Math.floor(
                        revenueValues.length / 2
                    );


                medianRevenue =
                    revenueValues.length % 2 === 0

                        ? (
                            revenueValues[middle - 1] +
                            revenueValues[middle]
                        ) / 2

                        : revenueValues[middle];

            }


            const priorityCustomers =
                analyticsCustomers.filter(
                    item =>
                        item.probability >= 70 &&
                        item.revenue >= medianRevenue
                );


            priorityCount =
                priorityCustomers.length;


            priorityRevenue =
                priorityCustomers.reduce(
                    (total, item) =>
                        total + item.revenue,
                    0
                );

        }


        // ====================================================
        // FINAL SAFETY NORMALIZATION
        // ====================================================

        highRiskCount =
            Math.max(
                0,
                Math.round(
                    highRiskCount
                )
            );


        revenueExposure =
            Math.max(
                0,
                revenueExposure
            );


        revenueShare =
            Math.max(
                0,
                Math.min(
                    revenueShare,
                    100
                )
            );


        averageRiskRevenue =
            Math.max(
                0,
                averageRiskRevenue
            );


        priorityCount =
            Math.max(
                0,
                Math.round(
                    priorityCount
                )
            );


        priorityRevenue =
            Math.max(
                0,
                priorityRevenue
            );



            
        // ====================================================
        // UPDATE TOP ANALYTICS KPI
        // ====================================================

        if (revenueExposureElement) {

            revenueExposureElement.textContent =
                currency(
                    revenueExposure
                );

        }


        if (riskCountElement) {

            riskCountElement.textContent =
                highRiskCount.toLocaleString();

        }


        if (revenueShareElement) {

            revenueShareElement.textContent =
                `${revenueShare.toFixed(1)}%`;

        }


        if (avgRiskRevenueElement) {

            avgRiskRevenueElement.textContent =
                currency(
                    averageRiskRevenue
                );

        }


        // ====================================================
        // FINANCIAL EXPOSURE
        // ====================================================

        if (revenueExposureDisplay) {

            revenueExposureDisplay.textContent =
                currency(
                    revenueExposure
                );

        }


        if (revenueRiskCustomers) {

            revenueRiskCustomers.textContent =
                highRiskCount.toLocaleString();

        }


        if (revenueShareAtRisk) {

            revenueShareAtRisk.textContent =
                `${revenueShare.toFixed(1)}%`;

        }


        if (avgRiskRevenue) {

            avgRiskRevenue.textContent =
                currency(
                    averageRiskRevenue
                );

        }


        // ====================================================
        // REVENUE RADAR
        // ====================================================

        const radarValue =
            Math.max(
                0,
                Math.min(
                    revenueShare,
                    100
                )
            );


        if (revenueRadarPercentage) {

            revenueRadarPercentage.textContent =
                `${revenueShare.toFixed(1)}%`;

        }


        if (revenueRadarFill) {

            revenueRadarFill.style.width =
                `${radarValue}%`;

        }


        // ====================================================
        // FINANCIAL EXPOSURE INSIGHT
        // ====================================================

        if (revenueExposureInsight) {

            revenueExposureInsight.textContent =

                `${highRiskCount.toLocaleString()} high-risk customers represent approximately ${currency(revenueExposure)} in monthly recurring revenue exposure.`;

        }


        // ====================================================
        // RETENTION PRIORITY MATRIX
        // ====================================================

        if (priorityPointsElement) {

            priorityPointsElement.innerHTML = "";


            const revenueValues =
                analyticsCustomers
                    .map(
                        item =>
                            item.revenue
                    )
                    .filter(
                        value =>
                            value > 0
                    );


            const maxRevenue =
                Math.max(
                    ...revenueValues,
                    1
                );


            analyticsCustomers
                .filter(
                    item =>
                        item.revenue > 0 ||
                        item.probability > 0
                )
                .slice(
                    0,
                    300
                )
                .forEach(
                    (item, index) => {

                        const point =
                            document.createElement(
                                "div"
                            );


                        point.className =
                            "priority-point";


                        // X AXIS = REVENUE

                        let x =
                            (
                                item.revenue /
                                maxRevenue
                            ) * 100;


                        // Y AXIS = CHURN RISK

                        let y =
                            100 -
                            item.probability;


                        x =
                            Math.max(
                                3,
                                Math.min(
                                    x,
                                    97
                                )
                            );


                        y =
                            Math.max(
                                3,
                                Math.min(
                                    y,
                                    97
                                )
                            );


                        point.style.left =
                            `${x}%`;


                        point.style.top =
                            `${y}%`;


                        point.style.animationDelay =
                            `${Math.min(
                                index * 0.008,
                                2
                            )}s`;


                        // POINT CLASSIFICATION

                        if (
                            item.probability >= 70 &&
                            item.revenue >=
                            maxRevenue * 0.5
                        ) {

                            point.classList.add(
                                "priority-high"
                            );

                        }

                        else if (
                            item.probability >= 50
                        ) {

                            point.classList.add(
                                "priority-risk"
                            );

                        }

                        else if (
                            item.revenue >=
                            maxRevenue * 0.5
                        ) {

                            point.classList.add(
                                "priority-value"
                            );

                        }

                        else {

                            point.classList.add(
                                "priority-low"
                            );

                        }


                        point.title =
                            `Churn Risk: ${item.probability.toFixed(1)}% | Monthly Revenue: ${currency(item.revenue)}`;


                        priorityPointsElement.appendChild(
                            point
                        );

                    }
                );

        }


        // ====================================================
        // PRIORITY COUNT
        // ====================================================

        if (
            priorityOpportunityCountElement
        ) {

            priorityOpportunityCountElement.textContent =
                priorityCount.toLocaleString();

        }


        // ====================================================
        // PRIORITY RECOMMENDATION
        // ====================================================

        if (
            priorityRecommendationElement
        ) {

            if (
                priorityCount > 0
            ) {

                priorityRecommendationElement.textContent =

                    `${priorityCount.toLocaleString()} high-value customers show elevated churn probability, representing approximately ${currency(priorityRevenue)} in monthly recurring revenue. These customers should receive priority retention outreach.`;

            }

            else {

                priorityRecommendationElement.textContent =
                    "No strong high-risk/high-value customer segment was detected.";

            }

        }


        // ====================================================
        // RETENTION OPPORTUNITY SUMMARY
        // ====================================================

        if (analyticsPriorityCustomers) {

            analyticsPriorityCustomers.textContent =
                priorityCount.toLocaleString();

        }


        // IMPORTANT FIX:
        // DISPLAY ACTUAL PRIORITY REVENUE
        // NOT AVERAGE PRIORITY REVENUE

        if (analyticsPriorityRevenue) {

            analyticsPriorityRevenue.textContent =
                currency(
                    priorityRevenue
                );

        }


        if (analyticsPriorityFocus) {

            analyticsPriorityFocus.textContent =
                priorityCount > 0
                    ? "High-value retention"
                    : "Monitor customer segment";

        }
// ========================================================
// EXECUTIVE REVENUE DONUT
// ========================================================

const analyticsDonutPercentage =
    getElement(
        "analyticsDonutPercentage"
    );

const analyticsDonutRevenue =
    getElement(
        "analyticsDonutRevenue"
    );

const analyticsProtectedRevenue =
    getElement(
        "analyticsProtectedRevenue"
    );

const analyticsExposureLevel =
    getElement(
        "analyticsExposureLevel"
    );

const revenueDonut =
    document.querySelector(
        ".revenue-donut"
    );


if (analyticsDonutPercentage) {

    analyticsDonutPercentage.textContent =
        `${revenueShare.toFixed(1)}%`;

}


if (analyticsDonutRevenue) {

    analyticsDonutRevenue.textContent =
        currency(
            revenueExposure
        );

}


const protectedRevenue =
    Math.max(
        0,
        totalMonthlyRevenue -
        revenueExposure
    );


if (analyticsProtectedRevenue) {

    analyticsProtectedRevenue.textContent =
        currency(
            protectedRevenue
        );

}


if (analyticsExposureLevel) {

    if (revenueShare >= 30) {

        analyticsExposureLevel.textContent =
            "Critical Exposure";

    }

    else if (revenueShare >= 20) {

        analyticsExposureLevel.textContent =
            "Elevated Exposure";

    }

    else if (revenueShare >= 10) {

        analyticsExposureLevel.textContent =
            "Moderate Exposure";

    }

    else {

        analyticsExposureLevel.textContent =
            "Controlled Exposure";

    }

}


if (revenueDonut) {

    const degrees =
        Math.min(
            100,
            Math.max(
                0,
                revenueShare
            )
        ) * 3.6;


    revenueDonut.style.background =
        `conic-gradient(
            #ef4444 0deg,
            #ef4444 ${degrees}deg,
            rgba(148,163,184,0.14) ${degrees}deg,
            rgba(148,163,184,0.14) 360deg
        )`;

}

        // ====================================================
        // ANALYTICS STATUS
        // ====================================================

        if (analyticsDatasetStatus) {

            analyticsDatasetStatus.textContent =
                totalCustomers > 0 ||
                customers.length > 0
                    ? "Connected"
                    : "Unavailable";

        }


        if (analyticsRiskStatus) {

            analyticsRiskStatus.textContent =
                highRiskCount > 0
                    ? "Ready"
                    : "Unavailable";

        }


        if (analyticsRevenueStatus) {

            analyticsRevenueStatus.textContent =
                revenueExposure > 0
                    ? "Ready"
                    : "Unavailable";

        }


        if (analyticsPriorityStatus) {

            analyticsPriorityStatus.textContent =
                priorityCount > 0
                    ? "Ready"
                    : "Unavailable";

        }


        // ====================================================
        // DEBUG
        // ====================================================

        console.log(
            "===================================="
        );

        console.log(
            "CHURNIQ ANALYTICS FINAL VALUES"
        );

        console.log(
            "Total Customers:",
            totalCustomers
        );

        console.log(
            "High-Risk Customers:",
            highRiskCount
        );

        console.log(
            "Revenue Exposure:",
            currency(
                revenueExposure
            )
        );

        console.log(
            "Revenue Share:",
            `${revenueShare.toFixed(1)}%`
        );

        console.log(
            "Average Risk Revenue:",
            currency(
                averageRiskRevenue
            )
        );

        console.log(
            "Priority Customers:",
            priorityCount
        );

        console.log(
            "Priority Revenue:",
            currency(
                priorityRevenue
            )
        );

        console.log(
            "===================================="
        );

        console.log(
            "Analytics updated successfully."
        );

    }

    catch (error) {

        console.error(
            "Analytics loading error:",
            error
        );


        // ====================================================
        // ERROR STATE
        // ====================================================

        if (revenueExposureElement) {
            revenueExposureElement.textContent =
                "Unavailable";
        }

        if (riskCountElement) {
            riskCountElement.textContent =
                "--";
        }

        if (revenueShareElement) {
            revenueShareElement.textContent =
                "--";
        }

        if (avgRiskRevenueElement) {
            avgRiskRevenueElement.textContent =
                "--";
        }


        if (revenueExposureDisplay) {
            revenueExposureDisplay.textContent =
                "--";
        }

        if (revenueRiskCustomers) {
            revenueRiskCustomers.textContent =
                "--";
        }

        if (revenueShareAtRisk) {
            revenueShareAtRisk.textContent =
                "--";
        }

        if (avgRiskRevenue) {
            avgRiskRevenue.textContent =
                "--";
        }


        if (revenueRadarPercentage) {
            revenueRadarPercentage.textContent =
                "0%";
        }

        if (revenueRadarFill) {
            revenueRadarFill.style.width =
                "0%";
        }


        if (revenueExposureInsight) {

            revenueExposureInsight.textContent =
                "Unable to calculate financial exposure from the current API response.";

        }


        if (priorityOpportunityCountElement) {

            priorityOpportunityCountElement.textContent =
                "--";

        }


        if (priorityRecommendationElement) {

            priorityRecommendationElement.textContent =
                "Unable to calculate retention opportunities.";

        }

    }

}

