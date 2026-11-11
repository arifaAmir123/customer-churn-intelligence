// ============================================================
// CHURNIQ — CUSTOMER CHURN INTELLIGENCE
// COMPLETE FRONTEND APPLICATION
// Dashboard + Customers + Prediction + Analytics + Settings
// ============================================================


// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = "";


// ============================================================
// GLOBAL STATE
// ============================================================

let analyticsCustomers = [];
let dashboardData = null;
let analyticsLoaded = false;


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


function numberValue(value, fallback = 0) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : fallback;
}


function formatNumber(value) {
    return numberValue(value).toLocaleString(
        "en-US"
    );
}


function formatCurrency(value) {
    return `$${numberValue(value).toLocaleString(
        "en-US",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    )}`;
}


function formatPercentage(value) {
    return `${numberValue(value).toFixed(1)}%`;
}


async function fetchJSON(url, options = {}) {

    const response = await fetch(
        url,
        {
            ...options,
            headers: {
                "Accept": "application/json",
                ...(options.headers || {})
            }
        }
    );

    if (!response.ok) {

        let message = "";

        try {
            message = await response.text();
        } catch (_) {
            message = "";
        }

        throw new Error(
            `${response.status} ${message}`
        );
    }

    return await response.json();
}


// ============================================================
// NAVIGATION
// ============================================================

function navigateToSection(
    sectionId,
    clickedButton = null
) {

    console.log(
        "Navigating to:",
        sectionId
    );


    // --------------------------------------------------------
    // Hide all content sections
    // --------------------------------------------------------

    const sections =
        document.querySelectorAll(
            ".content-section"
        );

    sections.forEach(section => {

        section.classList.remove(
            "active"
        );

        section.style.display = "none";

    });


    // --------------------------------------------------------
    // Show selected section
    // --------------------------------------------------------

    const selectedSection =
        getElement(sectionId);

    if (!selectedSection) {

        console.warn(
            "Section not found:",
            sectionId
        );

        return;
    }


    selectedSection.classList.add(
        "active"
    );

    selectedSection.style.display =
        "block";


    // --------------------------------------------------------
    // Update sidebar active state
    // --------------------------------------------------------

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );

    navItems.forEach(item => {

        item.classList.remove(
            "active"
        );

    });


    if (clickedButton) {

        clickedButton.classList.add(
            "active"
        );

    } else {

        const matchingButton =
            document.querySelector(
                `.nav-item[data-section="${sectionId}"]`
            );

        if (matchingButton) {

            matchingButton.classList.add(
                "active"
            );

        }

    }


    // --------------------------------------------------------
    // Update page title
    // --------------------------------------------------------

    const titles = {

        dashboardSection:
            "Customer Churn Dashboard",

        customersSection:
            "High-Risk Customers",

        predictionSection:
            "Churn Prediction",

        analyticsSection:
            "Enterprise Retention Intelligence",

        settingsSection:
            "Settings"

    };


    setText(
        "pageTitle",
        titles[sectionId] ||
        "Customer Churn Intelligence"
    );


    // --------------------------------------------------------
    // Section-specific loading
    // --------------------------------------------------------

    if (
        sectionId ===
        "analyticsSection"
    ) {

        loadAnalytics();

    }


    if (
        sectionId ===
        "customersSection"
    ) {

        loadRiskCustomers();

    }

}


// ============================================================
// DASHBOARD
// ============================================================

async function loadDashboard() {

    console.log(
        "Loading dashboard summary..."
    );


    try {

        const data =
            await fetchJSON(
                `${API_BASE_URL}/dashboard/summary`
            );


        console.log(
            "Dashboard API response:",
            data
        );


        dashboardData = data;


        updateDashboard(
            data
        );


        updateAPIStatus(
            true
        );


    } catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );


        updateAPIStatus(
            false
        );

    }

}


// ============================================================
// UPDATE DASHBOARD
// ============================================================

function updateDashboard(data) {

    if (!data) {
        return;
    }


    // --------------------------------------------------------
    // KPI values
    // --------------------------------------------------------

    setText(
        "totalCustomers",
        formatNumber(
            data.total_customers
        )
    );


    setText(
        "churnedCustomers",
        formatNumber(
            data.churned_customers
        )
    );


    setText(
        "churnRate",
        formatPercentage(
            data.churn_rate
        )
    );


    setText(
        "activeCustomers",
        formatNumber(
            data.active_customers
        )
    );


    // --------------------------------------------------------
    // Dashboard percentages
    // --------------------------------------------------------

    const total =
        numberValue(
            data.total_customers
        );

    const active =
        numberValue(
            data.active_customers
        );

    const churned =
        numberValue(
            data.churned_customers
        );


    if (total > 0) {

        const activeRate =
            (active / total) * 100;

        const churnRate =
            (churned / total) * 100;


        setText(
            "activePercentage",
            `${activeRate.toFixed(2)}%`
        );


        setText(
            "churnedPercentage",
            `${churnRate.toFixed(2)}%`
        );


        const retainedProgress =
            getElement(
                "retained-progress"
            );

        if (retainedProgress) {

            retainedProgress.style.width =
                `${activeRate}%`;

        }


        const churnedProgress =
            getElement(
                "churned-progress"
            );

        if (churnedProgress) {

            churnedProgress.style.width =
                `${churnRate}%`;

        }

    }


    // --------------------------------------------------------
    // Customer metrics
    // --------------------------------------------------------

    if (
        data.average_monthly_charges !==
        undefined
    ) {

        setText(
            "avgMonthlyCharges",
            formatCurrency(
                data.average_monthly_charges
            )
        );

    }


    if (
        data.average_tenure !==
        undefined
    ) {

        setText(
            "avgTenure",
            `${numberValue(
                data.average_tenure
            ).toFixed(2)} months`
        );

    }


    setText(
        "activeMetric",
        formatNumber(active)
    );


    setText(
        "churnedMetric",
        formatNumber(churned)
    );


    console.log(
        "Dashboard UI updated successfully."
    );

}


// ============================================================
// REFRESH DASHBOARD
// ============================================================

async function refreshDashboard() {

    console.log(
        "Refreshing dashboard..."
    );


    await loadDashboard();

    await loadRiskCustomers();


    if (analyticsLoaded) {

        await loadAnalytics();

    }

}


// ============================================================
// SETTINGS REFRESH
// ============================================================

function refreshDashboardFromSettings() {

    refreshDashboard();

}


// ============================================================
// API STATUS
// ============================================================

function updateAPIStatus(isOnline) {

    const status =
        document.querySelector(
            ".api-status"
        );


    const settingsStatus =
        getElement(
            "settingsApiStatus"
        );


    const modelStatus =
        getElement(
            "settingsModelStatus"
        );


    if (status) {

        if (isOnline) {

            status.innerHTML =
                `
                <span class="status-dot"></span>
                API Online
                `;

        } else {

            status.innerHTML =
                `
                <span class="status-dot"></span>
                API Offline
                `;

        }

    }


    if (settingsStatus) {

        settingsStatus.textContent =
            isOnline
                ? "Online"
                : "Offline";

        settingsStatus.classList.toggle(
            "online",
            isOnline
        );

    }


    if (modelStatus) {

        modelStatus.textContent =
            isOnline
                ? "Ready"
                : "Unavailable";

    }

}


// ============================================================
// HIGH-RISK CUSTOMERS
// ============================================================

async function loadRiskCustomers() {

    console.log(
        "Loading risk customers..."
    );


    // --------------------------------------------------------
    // IMPORTANT:
    // Current HTML uses #riskCustomersTable
    // --------------------------------------------------------

    const table =
        getElement(
            "riskCustomersTable"
        );


    if (!table) {

        console.warn(
            "Risk customer table not found."
        );

        return;

    }


    try {

        const customers =
            await fetchJSON(
                `${API_BASE_URL}/dashboard/risk-customers`
            );


        console.log(
            "Risk customers API response:",
            customers
        );


        table.innerHTML = "";


        if (
            !Array.isArray(customers) ||
            customers.length === 0
        ) {

            table.innerHTML =
                `
                <tr>
                    <td
                        colspan="4"
                        class="table-loading"
                    >
                        No high-risk customers found.
                    </td>
                </tr>
                `;

            return;

        }


        customers.sort(
            (a, b) =>
                numberValue(
                    b.churn_probability
                ) -
                numberValue(
                    a.churn_probability
                )
        );


        customers
            .slice(0, 10)
            .forEach(customer => {

                const probability =
                    numberValue(
                        customer.churn_probability
                    ) * 100;


                const riskLevel =
                    String(
                        customer.risk_level ||
                        "Unknown"
                    );


                const riskClass =
                    riskLevel
                        .toLowerCase()
                        .replace(
                            /\s+/g,
                            "-"
                        );


                const customerId =
                    customer.customerID ??
                    customer.customer_id ??
                    customer.id ??
                    "Unknown";


                const retentionAction =
                    customer.retention_action ??
                    "Review customer and initiate retention strategy.";


                const row =
                    document.createElement(
                        "tr"
                    );


                row.innerHTML =
                    `
                    <td>
                        <strong class="customer-id">
                            ${customerId}
                        </strong>
                    </td>

                    <td>
                        <strong class="probability">
                            ${probability.toFixed(2)}%
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

            });


        console.log(
            "Risk customer table updated successfully."
        );


    } catch (error) {

        console.error(
            "Risk customer loading error:",
            error
        );


        table.innerHTML =
            `
            <tr>
                <td
                    colspan="4"
                    class="table-loading"
                >
                    Unable to load high-risk customers.
                </td>
            </tr>
            `;

    }

}


// ============================================================
// CUSTOMER PREDICTION
// ============================================================

async function analyzeCustomer() {

    console.log(
        "Starting customer churn prediction..."
    );


    const result =
        getElement(
            "predictionResult"
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


    // --------------------------------------------------------
    // Read form fields
    // --------------------------------------------------------

    const customerData = {

        gender:
            getElement("gender")?.value,

        SeniorCitizen:
            Number(
                getElement(
                    "SeniorCitizen"
                )?.value || 0
            ),

        Partner:
            getElement("Partner")?.value,

        Dependents:
            getElement("Dependents")?.value,

        tenure:
            Number(
                getElement("tenure")?.value || 0
            ),

        PhoneService:
            getElement("PhoneService")?.value,

        MultipleLines:
            getElement("MultipleLines")?.value,

        InternetService:
            getElement("InternetService")?.value,

        OnlineSecurity:
            getElement("OnlineSecurity")?.value,

        OnlineBackup:
            getElement("OnlineBackup")?.value,

        DeviceProtection:
            getElement("DeviceProtection")?.value,

        TechSupport:
            getElement("TechSupport")?.value,

        StreamingTV:
            getElement("StreamingTV")?.value,

        StreamingMovies:
            getElement("StreamingMovies")?.value,

        Contract:
            getElement("Contract")?.value,

        PaperlessBilling:
            getElement("PaperlessBilling")?.value,

        PaymentMethod:
            getElement("PaymentMethod")?.value,

        MonthlyCharges:
            Number(
                getElement(
                    "MonthlyCharges"
                )?.value || 0
            ),

        TotalCharges:
            Number(
                getElement(
                    "TotalCharges"
                )?.value || 0
            )

    };


    console.log(
        "Customer data being sent to FastAPI:",
        customerData
    );


    try {

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


        if (!response.ok) {

            const errorText =
                await response.text();

            throw new Error(
                `Prediction failed: ${response.status} ${errorText}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Prediction API response:",
            data
        );


        const probability =
            numberValue(
                data.churn_probability
            ) * 100;


        setText(
            "riskLevel",
            String(
                data.risk_level ||
                "UNKNOWN"
            ).toUpperCase()
        );


        setText(
            "churnProbability",
            `${probability.toFixed(1)}%`
        );


        setText(
            "recommendation",
            data.retention_action ||
            "No retention action available."
        );


        console.log(
            "Prediction displayed successfully."
        );


    } catch (error) {

        console.error(
            "Prediction error:",
            error
        );


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
            "Unable to connect to the prediction service."
        );

    }

}


// ============================================================
// CLEAR PREDICTION
// ============================================================

function clearPrediction() {

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
            "flex";

    }


    if (predictionData) {

        predictionData.style.display =
            "none";

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

}


// ============================================================
// ANALYTICS
// ============================================================

async function loadAnalytics() {

    console.log(
        "Loading enterprise analytics..."
    );


    analyticsLoaded = true;


    try {

        const customers =
            await fetchJSON(
                `${API_BASE_URL}/dashboard/risk-customers`
            );


        if (
            !Array.isArray(customers)
        ) {

            throw new Error(
                "Risk customer API did not return an array."
            );

        }


        analyticsCustomers =
            customers;


        console.log(
            "Analytics customer dataset:",
            analyticsCustomers
        );


        calculateAndRenderAnalytics(
            analyticsCustomers
        );


        setText(
            "analyticsDatasetStatus",
            "Connected"
        );


        setText(
            "analyticsRiskStatus",
            "Ready"
        );


        setText(
            "analyticsRevenueStatus",
            "Ready"
        );


        setText(
            "analyticsPriorityStatus",
            "Ready"
        );


    } catch (error) {

        console.error(
            "Analytics loading error:",
            error
        );


        setText(
            "analyticsDatasetStatus",
            "Unavailable"
        );


        setText(
            "analyticsRiskStatus",
            "Unavailable"
        );


        setText(
            "analyticsRevenueStatus",
            "Unavailable"
        );


        setText(
            "analyticsPriorityStatus",
            "Unavailable"
        );


        setText(
            "revenueExposureInsight",
            "Unable to load analytics data from the FastAPI service."
        );


        setText(
            "priorityRecommendation",
            "Analytics data could not be loaded."
        );

    }

}


// ============================================================
// ANALYTICS CALCULATIONS
// ============================================================

function calculateAndRenderAnalytics(
    customers
) {

    if (!customers.length) {

        renderEmptyAnalytics();

        return;

    }


    // --------------------------------------------------------
    // Normalize customer records
    // --------------------------------------------------------

    const normalized =
        customers.map(
            customer => {

                const probability =
                    numberValue(
                        customer.churn_probability
                    );


                const monthlyCharges =
                    numberValue(
                        customer.MonthlyCharges ??
                        customer.monthly_charges ??
                        customer.monthlyCharges ??
                        customer.monthly_revenue ??
                        customer.revenue
                    );


                return {

                    ...customer,

                    probability:
                        probability,

                    monthlyCharges:
                        monthlyCharges

                };

            }
        );


    // --------------------------------------------------------
    // HIGH-RISK CUSTOMERS
    //
    // Production threshold = 25%
    // --------------------------------------------------------

    const highRisk =
        normalized.filter(
            customer =>
                customer.probability >=
                0.25
        );


    // --------------------------------------------------------
    // REVENUE EXPOSURE
    // --------------------------------------------------------

    const revenueExposure =
        highRisk.reduce(
            (
                total,
                customer
            ) =>
                total +
                customer.monthlyCharges,
            0
        );


    // --------------------------------------------------------
    // TOTAL MONTHLY REVENUE
    // --------------------------------------------------------

    let totalRevenue =
        normalized.reduce(
            (
                total,
                customer
            ) =>
                total +
                customer.monthlyCharges,
            0
        );


    // --------------------------------------------------------
    // If the API returned only high-risk records and
    // monthly charges are present, use dashboard average
    // to estimate total revenue.
    // --------------------------------------------------------

    if (
        totalRevenue <= 0 &&
        dashboardData
    ) {

        const averageCharges =
            numberValue(
                dashboardData.average_monthly_charges
            );


        const totalCustomers =
            numberValue(
                dashboardData.total_customers
            );


        if (
            averageCharges > 0 &&
            totalCustomers > 0
        ) {

            totalRevenue =
                averageCharges *
                totalCustomers;

        }

    }


    // --------------------------------------------------------
    // REVENUE SHARE
    // --------------------------------------------------------

    let revenueShare = 0;


    if (
        totalRevenue > 0
    ) {

        revenueShare =
            (
                revenueExposure /
                totalRevenue
            ) * 100;

    }


    // --------------------------------------------------------
    // AVERAGE RISK CUSTOMER REVENUE
    // --------------------------------------------------------

    const averageRiskRevenue =
        highRisk.length > 0
            ? revenueExposure /
              highRisk.length
            : 0;


    // --------------------------------------------------------
    // Render KPI cards
    // --------------------------------------------------------

    renderAnalyticsKPIs(
        revenueExposure,
        highRisk.length,
        revenueShare,
        averageRiskRevenue
    );


    // --------------------------------------------------------
    // Render Revenue Exposure card
    // --------------------------------------------------------

    renderRevenueExposure(
        revenueExposure,
        highRisk.length,
        revenueShare,
        averageRiskRevenue
    );


    // --------------------------------------------------------
    // Render Priority Matrix
    // --------------------------------------------------------

    renderPriorityMatrix(
        normalized
    );


    // --------------------------------------------------------
    // Render retention summary
    // --------------------------------------------------------

    renderRetentionSummary(
        highRisk,
        averageRiskRevenue
    );

}


// ============================================================
// ANALYTICS KPI CARDS
// ============================================================

function renderAnalyticsKPIs(
    revenueExposure,
    riskCustomers,
    revenueShare,
    averageRiskRevenue
) {

    setText(
        "analyticsRevenueExposure",
        formatCurrency(
            revenueExposure
        )
    );


    setText(
        "analyticsRiskCustomers",
        formatNumber(
            riskCustomers
        )
    );


    setText(
        "analyticsRevenueShare",
        formatPercentage(
            revenueShare
        )
    );


    setText(
        "analyticsAvgRiskRevenue",
        formatCurrency(
            averageRiskRevenue
        )
    );

}


// ============================================================
// REVENUE EXPOSURE
// ============================================================

function renderRevenueExposure(
    revenueExposure,
    riskCustomers,
    revenueShare,
    averageRiskRevenue
) {

    setText(
        "revenueExposureDisplay",
        formatCurrency(
            revenueExposure
        )
    );


    setText(
        "revenueRiskCustomers",
        formatNumber(
            riskCustomers
        )
    );


    setText(
        "revenueShareAtRisk",
        formatPercentage(
            revenueShare
        )
    );


    setText(
        "avgRiskRevenue",
        formatCurrency(
            averageRiskRevenue
        )
    );


    const radarFill =
        getElement(
            "revenueRadarFill"
        );


    if (radarFill) {

        radarFill.style.width =
            `${Math.min(
                Math.max(
                    revenueShare,
                    0
                ),
                100
            )}%`;

    }


    setText(
        "revenueRadarPercentage",
        formatPercentage(
            revenueShare
        )
    );


    const insight =
        `${formatNumber(
            riskCustomers
        )} high-risk customers represent approximately ${formatCurrency(
            revenueExposure
        )} in monthly recurring revenue exposure.`;


    setText(
        "revenueExposureInsight",
        insight
    );

}


// ============================================================
// PRIORITY MATRIX
// ============================================================

function renderPriorityMatrix(
    customers
) {

    const matrix =
        getElement(
            "priorityMatrixPoints"
        );


    if (!matrix) {

        console.warn(
            "Priority matrix container not found."
        );

        return;

    }


    matrix.innerHTML = "";


    if (!customers.length) {

        setText(
            "priorityOpportunityCount",
            "0"
        );


        setText(
            "priorityRecommendation",
            "No customer records are available for priority analysis."
        );


        return;

    }


    // --------------------------------------------------------
    // Find revenue range
    // --------------------------------------------------------

    const revenues =
        customers.map(
            customer =>
                numberValue(
                    customer.monthlyCharges
                )
        );


    const maxRevenue =
        Math.max(
            ...revenues,
            1
        );


    // --------------------------------------------------------
    // Create points
    // --------------------------------------------------------

    let highValueHighRisk = 0;


    customers
        .filter(
            customer =>
                customer.probability >= 0.25
        )
        .slice(0, 100)
        .forEach(
            customer => {

                const probability =
                    Math.min(
                        Math.max(
                            customer.probability,
                            0
                        ),
                        1
                    );


                const revenue =
                    numberValue(
                        customer.monthlyCharges
                    );


                // --------------------------------------------
                // X = revenue impact
                // --------------------------------------------

                let x =
                    maxRevenue > 0
                        ? (
                            revenue /
                            maxRevenue
                        ) * 100
                        : 0;


                // --------------------------------------------
                // Y = churn risk
                // --------------------------------------------

                let y =
                    probability *
                    100;


                // --------------------------------------------
                // Prevent points from touching borders
                // --------------------------------------------

                x =
                    Math.min(
                        96,
                        Math.max(
                            4,
                            x
                        )
                    );


                y =
                    Math.min(
                        96,
                        Math.max(
                            4,
                            y
                        )
                    );


                // --------------------------------------------
                // HIGH RISK / HIGH VALUE
                // --------------------------------------------

                if (
                    probability >= 0.50 &&
                    revenue >=
                    maxRevenue * 0.50
                ) {

                    highValueHighRisk++;

                }


                const point =
                    document.createElement(
                        "div"
                    );


                point.className =
                    "analytics-matrix-point";


                point.style.left =
                    `${x}%`;


                point.style.bottom =
                    `${y}%`;


                const customerId =
                    customer.customerID ??
                    customer.customer_id ??
                    customer.id ??
                    "Customer";


                point.title =
                    `${customerId} | Churn: ${(
                        probability * 100
                    ).toFixed(1)}% | Revenue: ${formatCurrency(
                        revenue
                    )}`;


                matrix.appendChild(
                    point
                );

            }
        );


    // --------------------------------------------------------
    // Opportunity count
    // --------------------------------------------------------

    setText(
        "priorityOpportunityCount",
        formatNumber(
            highValueHighRisk
        )
    );


    // --------------------------------------------------------
    // Recommendation
    // --------------------------------------------------------

    let recommendation;


    if (
        highValueHighRisk > 0
    ) {

        recommendation =
            `${formatNumber(
                highValueHighRisk
            )} high-value customers show elevated churn risk. Prioritize personalized retention offers, proactive outreach, and service recovery for this segment.`;

    } else {

        recommendation =
            "No high-value/high-risk concentration was detected. Continue monitoring customers with elevated churn probability.";

    }


    setText(
        "priorityRecommendation",
        recommendation
    );

}


// ============================================================
// RETENTION SUMMARY
// ============================================================

function renderRetentionSummary(
    highRisk,
    averageRiskRevenue
) {

    setText(
        "analyticsPriorityCustomers",
        formatNumber(
            highRisk.length
        )
    );


    setText(
        "analyticsPriorityRevenue",
        formatCurrency(
            averageRiskRevenue
        )
    );


    setText(
        "analyticsPriorityFocus",
        "High-value retention"
    );

}


// ============================================================
// EMPTY ANALYTICS
// ============================================================

function renderEmptyAnalytics() {

    setText(
        "analyticsRevenueExposure",
        "$0.00"
    );


    setText(
        "analyticsRiskCustomers",
        "0"
    );


    setText(
        "analyticsRevenueShare",
        "0.0%"
    );


    setText(
        "analyticsAvgRiskRevenue",
        "$0.00"
    );


    setText(
        "revenueExposureDisplay",
        "$0.00"
    );


    setText(
        "revenueRiskCustomers",
        "0"
    );


    setText(
        "revenueShareAtRisk",
        "0.0%"
    );


    setText(
        "avgRiskRevenue",
        "$0.00"
    );


    setText(
        "revenueRadarPercentage",
        "0.0%"
    );


    setText(
        "revenueExposureInsight",
        "No high-risk customer data is currently available."
    );


    setText(
        "priorityOpportunityCount",
        "0"
    );


    setText(
        "priorityRecommendation",
        "No priority opportunities are currently available."
    );

}


// ============================================================
// ANALYTICS MATRIX CSS
//
// This is intentionally injected here so the matrix works
// even if the old Analytics CSS is incomplete.
// It does NOT alter Dashboard/Prediction/Settings styling.
// ============================================================

function installAnalyticsMatrixStyles() {

    if (
        getElement(
            "churniqAnalyticsMatrixStyles"
        )
    ) {

        return;

    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "churniqAnalyticsMatrixStyles";


    style.textContent = `

        /* ====================================================
           CHURNIQ ANALYTICS MATRIX
        ==================================================== */

        .priority-matrix-wrapper {
            width: 100%;
            margin-top: 24px;
        }


        .priority-matrix {
            position: relative;
            width: 100%;
            min-height: 360px;

            display: grid;

            grid-template-columns:
                1fr
                1fr;

            grid-template-rows:
                1fr
                1fr;

            overflow: hidden;

            border: 1px solid #dfe4ec;

            border-radius: 12px;

            background: #ffffff;
        }


        .priority-matrix::before {
            content: "";

            position: absolute;

            top: 50%;
            left: 0;

            width: 100%;
            height: 1px;

            background: #dfe4ec;

            z-index: 1;
        }


        .priority-matrix::after {
            content: "";

            position: absolute;

            top: 0;
            left: 50%;

            width: 1px;
            height: 100%;

            background: #dfe4ec;

            z-index: 1;
        }


        .matrix-zone {
            position: relative;

            display: flex;

            align-items: flex-start;
            justify-content: flex-start;

            padding: 18px;

            font-size: 11px;

            font-weight: 700;

            letter-spacing: 0.04em;

            color: #667085;

            z-index: 0;
        }


        .zone-high-value-risk {
            background:
                linear-gradient(
                    135deg,
                    rgba(254, 226, 226, 0.60),
                    rgba(255, 247, 237, 0.45)
                );
        }


        .zone-high-risk {
            background:
                linear-gradient(
                    135deg,
                    rgba(255, 247, 237, 0.60),
                    rgba(255, 255, 255, 0.70)
                );
        }


        .zone-low-risk {
            background:
                linear-gradient(
                    135deg,
                    rgba(239, 246, 255, 0.55),
                    rgba(255, 255, 255, 0.70)
                );
        }


        .zone-low-priority {
            background:
                linear-gradient(
                    135deg,
                    rgba(248, 250, 252, 0.70),
                    rgba(255, 255, 255, 0.80)
                );
        }


        .priority-matrix-points {
            position: absolute;

            inset: 0;

            z-index: 5;

            pointer-events: none;
        }


        .analytics-matrix-point {
            position: absolute;

            width: 9px;
            height: 9px;

            margin-left: -4.5px;
            margin-bottom: -4.5px;

            border-radius: 50%;

            background: #ef4444;

            border: 2px solid #ffffff;

            box-shadow:
                0 2px 5px rgba(15, 23, 42, 0.25);

            transform:
                translate(
                    0,
                    0
                );

            transition:
                transform 0.15s ease,
                box-shadow 0.15s ease;
        }


        .analytics-matrix-point:hover {
            transform:
                scale(1.7);

            box-shadow:
                0 4px 12px rgba(15, 23, 42, 0.35);
        }


        .matrix-y-label {
            margin-bottom: 12px;

            font-size: 12px;

            font-weight: 700;

            letter-spacing: 0.06em;

            color: #344054;
        }


        .matrix-x-label {
            margin-top: 12px;

            text-align: center;

            font-size: 12px;

            font-weight: 700;

            letter-spacing: 0.06em;

            color: #344054;
        }


        .priority-result {
            margin-top: 22px;

            display: flex;

            align-items: center;

            gap: 12px;
        }


        .priority-result-icon {
            width: 38px;
            height: 38px;

            display: flex;

            align-items: center;
            justify-content: center;

            border-radius: 10px;

            background: #eef2ff;

            color: #4f46e5;

            font-size: 18px;
        }


        .priority-result strong {
            display: block;

            font-size: 18px;

            color: #172033;
        }


        .priority-result span {
            display: block;

            margin-top: 3px;

            font-size: 12px;

            color: #667085;
        }


        .analytics-insight {
            margin-top: 18px;

            padding: 16px 18px;

            border-radius: 10px;

            background: #f8fafc;

            border: 1px solid #e7eaf0;

            color: #475467;

            font-size: 13px;

            line-height: 1.6;
        }


        @media (max-width: 800px) {

            .priority-matrix {
                min-height: 300px;
            }

        }

    `;


    document.head.appendChild(
        style
    );

}


// ============================================================
// SETTINGS
// ============================================================

function initializeSettings() {

    setText(
        "settingsApiEndpoint",
        API_BASE_URL
    );


    setText(
        "settingsApiStatus",
        "Checking..."
    );


    setText(
        "settingsModelStatus",
        "Checking..."
    );

}


// ============================================================
// GLOBAL EVENT HANDLERS
// ============================================================

function initializeNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        button => {

            button.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const sectionId =
                        button.dataset.section;

                    if (sectionId) {

                        navigateToSection(
                            sectionId,
                            button
                        );

                    }

                }
            );

        }
    );

}


// ============================================================
// INITIALIZE APPLICATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    async function () {

        console.log(
            "================================================"
        );

        console.log(
            "ChurnIQ frontend initialized."
        );

        console.log(
            "================================================"
        );


        // ----------------------------------------------------
        // Install Analytics Matrix styling
        // ----------------------------------------------------

        installAnalyticsMatrixStyles();


        // ----------------------------------------------------
        // Navigation
        // ----------------------------------------------------

        initializeNavigation();


        // ----------------------------------------------------
        // Settings
        // ----------------------------------------------------

        initializeSettings();


        // ----------------------------------------------------
        // Set initial section
        // ----------------------------------------------------

        const sections =
            document.querySelectorAll(
                ".content-section"
            );


        sections.forEach(
            section => {

                if (
                    section.id ===
                    "dashboardSection"
                ) {

                    section.style.display =
                        "block";

                    section.classList.add(
                        "active"
                    );

                } else {

                    section.style.display =
                        "none";

                    section.classList.remove(
                        "active"
                    );

                }

            }
        );


        // ----------------------------------------------------
        // Load Dashboard
        // ----------------------------------------------------

        await loadDashboard();


        // ----------------------------------------------------
        // Load Risk Customers
        // ----------------------------------------------------

        await loadRiskCustomers();


        console.log(
            "ChurnIQ initialization completed."
        );

    }
);