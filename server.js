require("./config/logger").intialize();
const logger = require("./config/logger").logger;
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const passport = require("passport");
const path = require("path");

//routes
const authRoutes = require("./routes/auth");
const projInfoRoutes = require("./routes/projectInformation");
const preliminaryRequestRoutes = require("./routes/preliminaryRequest");
const loanFinancial = require("./routes/loanFinancial");
const loanMarketing = require("./routes/loanMarketing");
const communications = require("./routes/communications");
const loanTechnical = require("./routes/loanTechnical");
const documentUpload = require("./routes/documentUpload");
const myLoans = require("./routes/myLoans");
const myLoanContractors = require("./routes/myLoanContractors");
const myLoanContracts = require("./routes/myLoanContracts");
const commonComments = require("./routes/commonComments");
const ivrManagement = require("./routes/ivrManagement");
const nonBorrowingCertificate = require("./routes/nonBorrowingCertificate");
const claimDisbursement = require("./routes/disbursement");
const representativesList = require("./routes/representativesList");
const rcjTab = require("./routes/loanRCJ");
const rcyTab = require("./routes/loanRCY");

const landLoanWorkFlow = require('./routes/LandLoanWorkflow')
const LLModon = require('./routes/LLModon');
const LLECA = require('./routes/LLECA');
const factoryLoan = require('./routes/factoryloan');
const clientDashboard = require('./routes/clientDashboard');
const rcyRequests = require('./routes/RCYRequests');
const loanrcy = require('./routes/loanRCY');
const rcjRequests = require('./routes/RCJRequests');
const admindashboard = require('./routes/admin-dashboard');
const adminUser = require('./routes/admin-User');
// Passport Config
require("./config/passport")(passport);

function SERVER() {
    var self = this;
    self.configureExpress();
};

SERVER.prototype.configureExpress = function () {
    var self = this;
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // app.use(express.static(path.join(__dirname, "dist")));
    // serve angular front end files from root path
    app.use('/', express.static('dist', { redirect: false }));

    // rewrite virtual urls to angular app to enable refreshing of internal pages
    app.get('*', function (req, res, next) {
        res.sendFile(path.resolve('dist/index.html'));
    });

    // Passport middleware
    app.use(passport.initialize());

    app.use("/api/auth", authRoutes);
    app.use("/api/projectInformation", projInfoRoutes);
    app.use("/api/preliminaryRequest", preliminaryRequestRoutes);
    app.use("/api/loanFinancial", loanFinancial);
    app.use("/api/loanMarketing", loanMarketing);
    app.use("/api/communications", communications);
    app.use("/api/loanTechnical", loanTechnical);
    app.use("/api/commonDocumentUpload", documentUpload);
    app.use("/api/myLoans", myLoans);
    app.use("/api/myLoanContractors", myLoanContractors);
    app.use("/api/myLoanContracts", myLoanContracts);
    app.use("/api/commonComments", commonComments);
    app.use("/api/ivrManagement", ivrManagement);
    app.use("/api/nonBorrowingCertificate", nonBorrowingCertificate);
    app.use("/api/claimDisbursement", claimDisbursement);
    app.use("/api/representativesList", representativesList);
    app.use("/api/loanRCJ", rcjTab);
    app.use("/api/loanRCY", rcyTab);

    app.use("/api/LandLoan", landLoanWorkFlow);
    app.use("/api/modon", LLModon);
    app.use("/api/eca", LLECA)
    app.use("/api/factoryloan", factoryLoan);
    app.use("/api/clientDashboard", clientDashboard);
    app.use("/api/RCYRequests", rcyRequests);
    app.use("/api/RCJRequests", rcjRequests);
    app.use("/api/loanRCY", loanrcy);
    app.use("/api/admindashboard", admindashboard);
    app.use("/api/admin", adminUser);
    //app.use("/api/disbursement", disbursementRoute);
    self.startServer();
};

var port = process.env.PORT || 12010;
SERVER.prototype.startServer = function () {
    app.listen(port, function () {
        logger.info("All right ! I am alive at Port " + port + ".");
    });
    module.exports = app; // for testing
};

//connect database
// db.connectMysql()
//     .then(sessionStore => {
//         app.use(
//             session({
//                 key: "session_teacher_klprd",
//                 secret: "KlearnKaar@123",
//                 store: sessionStore,
//                 resave: false,
//                 saveUninitialized: false
//             })
//         );
//         setupRoutes();
//     })
//     .catch(err => {
//         logger.error(err);
//         process.exit(1);
//     });

// const setupRoutes = () => {
//     app.use("/api/auth", authRoutes);
//     app.use("/api/users", userRoutes);
//     startServer();
// };

// const port = process.env.PORT || 12010;
// const startServer = () => {
//     app.listen(port, function() {
//         logger.info("KLearn web application running at Port " + port + ".");
//     });
//     module.exports = app;
// };


new SERVER(); 