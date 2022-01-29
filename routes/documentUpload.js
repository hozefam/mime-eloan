const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const config = require("config");
const axios = require("axios");
const moment = require("moment");
const querystring = require("querystring");
const logger = require("../config/logger").logger;
const db = require("../config/database");
const passport = require("passport");
const _ = require("underscore");
const randtoken = require("rand-token");
const apis = require("../model/apis");
const Cryptr = require('cryptr');
const cryptr = new Cryptr(config.cpKey);
var multer = require('multer')
var storage = multer.memoryStorage();

var limits = {
    files: 10, // allow only 1 file per request
    fileSize: 100 * 1024 * 1024 * 1024 // 100 MB (max file size)
};

var upload = multer({ storage: storage, limits: limits });
var FormData = require('form-data');
var fs = require('fs');
var request = require("request");
var streamifier = require('streamifier');

var DocumentDefinitions = [{
    "Id": "399",
    "Code": "RealEstate",
    "Name": "Real Estate",
    "Type": "I"
},
{
    "Id": "400",
    "Code": "StockPortfolio",
    "Name": "Stock Portfolio",
    "Type": "I"
},
{
    "Id": "121",
    "Code": "DocumentLetter",
    "Name": "Document/Letter",
    "Type": "I"
},
{
    "Id": "367",
    "Code": "ArticleofAssociation",
    "Name": "Article of Association",
    "Type": "I"
},
{
    "Id": "368",
    "Code": "IndustrialLicense",
    "Name": "Industrial License",
    "Type": "I"
},
{
    "Id": "372",
    "Code": "FinancialStatement",
    "Name": "Financial Statement",
    "Type": "I"
},
{
    "Id": "375",
    "Code": "AuthorizationLetter",
    "Name": "Authorization Letter",
    "Type": "I"
},
{
    "Id": "380",
    "Code": "IDProof",
    "Name": "ID Proof",
    "Type": "I"
},
{
    "Id": "381",
    "Code": "FireFightingDrawiing",
    "Name": "Fire Fighting Drawing",
    "Type": "I"
},
{
    "Id": "382",
    "Code": "FireAlarmDrawing",
    "Name": "Fire Alarm Drawing",
    "Type": "I"
},
{
    "Id": "383",
    "Code": "EnviromentCertificate",
    "Name": "Enviroment Impact Assesment OR Enviromental certificate",
    "Type": "I"
},
{
    "Id": "384",
    "Code": "SafetyWorksQuotation",
    "Name": "Safety Works Quotation",
    "Type": "I"
},
{
    "Id": "385",
    "Code": "MachineryQuotation",
    "Name": "Machinery Quotation",
    "Type": "I"
},
{
    "Id": "386",
    "Code": "MachineryLayout",
    "Name": "Machinery Layout",
    "Type": "I"
},
{
    "Id": "387",
    "Code": "CustomClearance",
    "Name": "Custom Clearance",
    "Type": "I"
},
{
    "Id": "388",
    "Code": "MachineryRawMaterialWarehouses",
    "Name": "Machinery Raw material Warehouses",
    "Type": "I"
},
{
    "Id": "389",
    "Code": "MachineryFinishedGoods",
    "Name": "Machinery Finished Goods",
    "Type": "I"
},
{
    "Id": "390",
    "Code": "TechnicalSpecification",
    "Name": "Technical Specification",
    "Type": "I"
},
{
    "Id": "391",
    "Code": "Quotation",
    "Name": "Quotation",
    "Type": "I"
},
{
    "Id": "392",
    "Code": "GeneralSiteLayout",
    "Name": "General Site Layout",
    "Type": "I"
},
{
    "Id": "393",
    "Code": "BuildingandCivilWorksDrawings",
    "Name": "Building and Civil Works Drawings",
    "Type": "I"
},
{
    "Id": "394",
    "Code": "DesignandSupervisionContracts",
    "Name": "Design and Supervision Contracts / Offers",
    "Type": "I"
},
{
    "Id": "395",
    "Code": "BillofQuantitiesforBuildings",
    "Name": "Bill of Quantities ( BOQ ) for Buildings",
    "Type": "I"
},
{
    "Id": "396",
    "Code": "PermittoBuildandOperate",
    "Name": "Permit to Build and Operate",
    "Type": "I"
},
{
    "Id": "397",
    "Code": "SelectedQuotationContractsforbuild",
    "Name": "Selected Quotation / Contracts for buildings",
    "Type": "I"
},
{
    "Id": "398",
    "Code": "RawMaterialQuotation",
    "Name": "Raw Material Quotation",
    "Type": "I"
},
{
    "Id": "369",
    "Code": "LandLeaseagreement",
    "Name": "Land Lease agreement",
    "Type": "I"
},
{
    "Id": "401",
    "Code": "NoObjectionLetter",
    "Name": "No Objection Letter",
    "Type": "I"
},
{
    "Id": "402",
    "Code": "ExpectedSalesVolume",
    "Name": "Expected Sales Volume",
    "Type": "I"
},
{
    "Id": "407",
    "Code": "SIDFClause",
    "Name": "SIDF Clause",
    "Type": "I"
},
{
    "Id": "359",
    "Code": "TentativeRepaymentSchedule",
    "Name": "Tentative Repayment Schedule",
    "Type": "I"
},
{
    "Id": "408",
    "Code": "BankGuarantee",
    "Name": "Bank Guarantee",
    "Type": "I"
},
{
    "Id": "409",
    "Code": "BankStatement",
    "Name": "Bank Statement",
    "Type": "I"
},
{
    "Id": "410",
    "Code": "LetterOfCredit",
    "Name": "Letter Of Credit",
    "Type": "I"
},
{
    "Id": "411",
    "Code": "TransferApplication",
    "Name": "Transfer Application",
    "Type": "I"
},
{
    "Id": "412",
    "Code": "PaymentReceipt",
    "Name": "Payment Receipt",
    "Type": "I"
},
{
    "Id": "413",
    "Code": "BankDebitNote",
    "Name": "Bank Debit Note",
    "Type": "I"
},
{
    "Id": "414",
    "Code": "ProgressBills",
    "Name": "Progress Bills",
    "Type": "I"
},
{
    "Id": "415",
    "Code": "VehicleRegistration",
    "Name": "Vehicle Registration",
    "Type": "I"
},
{
    "Id": "416",
    "Code": "Istimara",
    "Name": "Istimara",
    "Type": "I"
},
{
    "Id": "417",
    "Code": "CopyofConsultant Certificate",
    "Name": "Copy of Consultant Certificate",
    "Type": "I"
},
{
    "Id": "418",
    "Code": "AgreedtoCertificateofOrigin",
    "Name": "Agreed to  Certificate of Origin",
    "Type": "I"
},
{
    "Id": "419",
    "Code": "Agreedtoshippingdocuments",
    "Name": "Agreed to shipping documents(Packing List - Bill of Lading)",
    "Type": "I"
},
{
    "Id": "420",
    "Code": "AgreedtoCustomsDeclaration",
    "Name": "Agreed to Customs Declaration",
    "Type": "I"
},
{
    "Id": "421",
    "Code": "Freight",
    "Name": "Freight",
    "Type": "I"
},
{
    "Id": "422",
    "Code": "Insurance",
    "Name": "Insurance",
    "Type": "I"
},
{
    "Id": "423",
    "Code": "BankCharges",
    "Name": "Bank Charges",
    "Type": "I"
}
];

// documentDownload = documentDownload[0] + config.sidfAuthentication.username + ":" + config.sidfAuthentication.password + "@" + documentDownload[1];
var apisJson = {};
apisJson = JSON.parse(apis.apisList());
var documentDownloadUrl = apisJson.downloadDocumentsPublicURL.replace('://', "://" + config.sidfAuthentication.username + ":" + config.sidfAuthentication.password + "@");

router.post("/signUpUploadDocuments", upload.array('content', 1),
    // passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = "";

        entityName = req.body.entityName;
        RelatedEntityName = req.body.RelatedEntityName;
        entityId = req.body.entityId;
        RelatedEntityId = req.body.RelatedEntityId;
        operationType = req.body.operationType;

        if (req.files.length == 0)
            res.status(400).json({ MessType: 'E', error: true, message: "File not empty, please check" });
        else if (req.files[0].size > limits.fileSize) {
            res.status(400).json({ MessType: 'E', error: true, message: "File size must be less than or equal to 100 mb" });
        } else {
            var bodyData = {
                "Id": 0,
                "Definition": {
                    "Id": "969", //need to change dynamically
                    "Code": "DC_LMSCRMDocuments"
                },
                "EntityId": entityId,
                "EntityName": entityName,
                "RelatedEntityId": RelatedEntityId,
                "RelatedEntityName": RelatedEntityName //"Reference"
            }
            var projects = "projects";
            var operationName = "SIDFPreparationDocuments";
            if (operationType == 'p') {
                operationName = "SIDFPreparationDocuments";
                url = apisJson.createDocumentIdForUpload.replace("entityName", entityName).replace("entityId", entityId).replace("operationName", operationName);
            } else if (operationType == 'r') {
                operationName = "SIDFBPDocuments";
                projects = "businessPartnerProcesses";
                url = apisJson.createDocumentIdForUpload.replace("entityName", entityName).replace("entityId", entityId).replace("operationName", operationName).replace("projects", projects);
            }
            if (url == "") {
                res.status(400).json({ MessType: 'E', error: true, message: "Operation invalid" });
            }

            axios({
                method: 'post',
                url,
                auth: config.sidfAuthentication,
                data: bodyData,
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                }
            })
                .then(function (response) {
                    uploadDocument(response.data, req, res);

                })
                .catch(function (error) {
                    logger.info("Error while creating document id to upload file", error);
                    res.json({ MessType: 'E', error: true, message: "Error while creating document id to upload file" });
                });
        }


    });

router.post("/uploadDocuments", upload.array('content', 10),
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        let url = "";

        entityName = req.body.entityName;
        RelatedEntityName = req.body.RelatedEntityName;
        entityId = req.body.entityId;
        RelatedEntityId = req.body.RelatedEntityId;
        operationType = req.body.operationType;

        if (req.files.length == 0)
            res.status(400).json({ MessType: 'E', error: true, message: "File not empty, please check" });
        else if (req.files[0].size > limits.fileSize) {
            res.status(400).json({ MessType: 'E', error: true, message: "File size must be less than or equal to 100 mb" });
        } else {
            var bodyData = {
                "Id": 0,
                "Definition": {
                    "Id": "956", //need to change dynamically
                    "Code": "DC_LMSCRMDocuments"
                },
                "EntityId": entityId,
                "EntityName": entityName,
                "RelatedEntityId": RelatedEntityId,
                "RelatedEntityName": RelatedEntityName //"Reference"
            }

            var operationName = "SIDFPreparationDocuments";
            var projects = "projects";
            if (operationType == 'p') {
                operationName = "SIDFPreparationDocuments";
                url = apisJson.createDocumentIdForUpload.replace("entityName", entityName).replace("entityId", entityId).replace("operationName", operationName);
            } else if (operationType == 'r') {
                operationName = "SIDFBPDocuments";
                projects = "businessPartnerProcesses";
                url = apisJson.createDocumentIdForUpload.replace("entityName", entityName).replace("entityId", entityId).replace("operationName", operationName).replace("projects", projects);
            } else if (operationType == 'l') {
                operationName = "SIDFPreparationDocuments";
                bodyData.Definition.Id = "961";
                bodyData.Definition.Code = "DC_LMSCRMDocuments";
                url = apisJson.createDocumentIdForUpload.replace("entityName", entityName).replace("entityId", entityId).replace("operationName", operationName);
            }
            // console.log(JSON.stringify(bodyData));
            if (url == "") {
                res.status(400).json({ MessType: 'E', error: true, message: "Operation invalid" });
            }
            if (req.body.exitDocumentId != undefined && req.body.exitDocumentId > 0) {
                console.log(req.body.exitDocumentId);
                var resData = { "Id": req.body.exitDocumentId };
                uploadDocument(resData, req, res);
            } else {
                console.log("new Id");
                axios({
                    method: 'post',
                    url,
                    auth: config.sidfAuthentication,
                    data: bodyData,
                    headers: {
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                    }
                })
                    .then(function (response) {
                        uploadDocument(response.data, req, res);
                    })
                    .catch(function (error) {
                        logger.info("Error while creating document id to upload file", error);
                        res.json({ MessType: 'E', error: true, message: "Error while creating document id to upload file" });
                    });
            }
        }


    });

function uploadDocument(data, req, res) {
    // passport.authenticate("jwt", { session: false }),
    // (req, res) => {
    // console.log(data);
    var flag = 0;
    // body1 = "";

    try {
        entityName = req.body.entityName;
        entityId = req.body.entityId;
        documentId = data.Id;
        RelatedEntityId = req.body.RelatedEntityId;
        operationType = req.body.operationType;

        var DocumentDefId = req.body.documentDefId;
        var filterDocDef = _.where(DocumentDefinitions, { Id: DocumentDefId });
        let url = "";
        var projects = "projects";
        if (operationType == 'p') {
            operationName = "SIDFPreparationDocuments";
            url = apisJson.uploadDocumentByDocumentId.replace("entityName", entityName).replace("entityId", entityId).replace("documentId", documentId).replace("DocumentDefId", DocumentDefId).replace("operationName", operationName);
        } else if (operationType == 'r') {
            operationName = "SIDFBPDocuments";
            projects = "businessPartnerProcesses";
            url = apisJson.uploadDocumentByDocumentId.replace("entityName", entityName).replace("entityId", entityId).replace("documentId", documentId).replace("DocumentDefId", DocumentDefId).replace("operationName", operationName).replace("projects", projects);
        } else if (operationType == 'l') {
            operationName = "SIDFPreparationDocuments";
            url = apisJson.uploadDocumentByDocumentId.replace("entityName", entityName).replace("entityId", entityId).replace("documentId", documentId).replace("DocumentDefId", DocumentDefId).replace("operationName", operationName);
        }

        if (url == "") {
            res.status(400).json({ MessType: 'E', error: true, message: "Operation invalid" });
        }

        var documnetIds = [];
        if (operationType)

            for (var x = 0; x < req.files.length; ++x) {

                documentName = req.files[x].originalname;
                var stream = new Buffer(req.files[x].buffer);
                var options = {
                    method: 'POST',
                    url: url,
                    headers: {
                        'cache-control': 'no-cache',
                        Authorization: "Basic " + new Buffer(config.sidfAuthentication.username + ":" + config.sidfAuthentication.password).toString("base64"),
                        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                        'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
                    },
                    formData: {
                        content: {
                            value: stream,
                            options: {
                                filename: documentName, //'C:\\Users\\msrinivasarao\\Desktop\\Testing.txt',
                                contentType: null
                            }
                        },
                        documentName: documentName
                    }
                };

                request(options, function (error, response, body) {
                    if (response) {
                        if (error) {
                            res.json({ MessType: 'E', error: true, message: "Error while uploading document" });
                            logger.info("Error while uploading document", error);
                        } else {

                            var resultId = "";
                            if (body.indexOf("/") !== -1) {
                                var output = {
                                    "EntityId": entityId,
                                    "RefId": documentId,
                                    "RelatedEntityId": RelatedEntityId,
                                    "DocumentId": body.split('/')[0],
                                    "FileName": req.files[flag].originalname,
                                    "DocumentDefId": DocumentDefId,
                                    "DocumentDefName": filterDocDef.length > 0 ? filterDocDef[0].Name : "DocumentDefId"
                                };

                                documnetIds.push(output);

                            }

                            logger.info("uploadded Success", body);
                            flag = flag + 1;
                            if (flag === req.files.length) {
                                var outputJson = { "url": documentDownloadUrl, "documentList": documnetIds };
                                res.json({ MessType: 'S', error: false, message: "Success", data: outputJson });
                            }
                        }
                    }

                });
            }

    } catch (error) {
        logger.info("Error while uploading document", error);
        res.json({ MessType: 'E', error: true, message: "Error while uploading document" });
    }

};

router.post("/getDocumentsByEntityId",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        entityId = req.body.entityId;
        operationType = req.body.operationType;

        var operationName = "SIDFPreparationDocuments";
        var type = "projects";
        if (operationType == "p" || operationType == "l") {
            operationName = "SIDFPreparationDocuments";
            type = "projects";
        } else if (operationType == "r") {
            operationName = "SIDFPreparationDocuments";
            type = "businessPartnerProcesses";
        } else if (operationType == "c") { //communication receive requests
            operationName = "SIDFPreparationDocuments";
            type = "bpManagement";
        }

        let url = apisJson.getDocumentsByEntityId.replace("entityId", entityId).replace("operationName", operationName).replace("typeIP", type);
        // console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            }
        })
            .then(function (response) {
                res.send({ MessType: 'S', error: false, downloadDocumentUrl: documentDownloadUrl, result: response.data });
            })
            .catch(function (error) {
                logger.error("Error while getting documents , Id " + entityId, error);
                res.json({ MessType: 'E', error: true, MessText: "Error while getting documents" });
            });

    });

router.post("/deleteDocument",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        entityId = req.body.entityId;
        refId = req.body.refId;
        documentId = req.body.documentId;
        operationType = req.body.operationType;

        var operationName = "SIDFPreparationDocuments";
        if (operationType == "p" || operationType == "l")
            operationName = "SIDFPreparationDocuments";
        let url = apisJson.deleteDocumentByDocumentId.replace("entityId", entityId).replace("refId", refId).replace("documentId", documentId).replace("operationName", operationName);

        axios({
            method: 'delete',
            url,
            auth: config.sidfAuthentication,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
            .then(function (response) {
                res.send({ MessType: 'S', error: false, result: response.data });
            })
            .catch(function (error) {
                res.json({ MessType: 'E', error: true, message: "Error while deleting document" });
            });

    });


router.post("/downloadDocument",
    passport.authenticate("jwt", { session: false }), (req, res) => {

        entityId = req.body.entityId;
        refId = req.body.refId;
        documentId = req.body.documentId;
        operationType = req.body.operationType;
        fileName = req.body.fileName;

        var operationName = "SIDFPreparationDocuments";
        if (operationType == "p" || operationType == "l")
            operationName = "SIDFPreparationDocuments";
        // console.log(fileName);
        let url = apisJson.downloadDocumentsBase64URL.replace("entityId", entityId).replace("refId", refId).replace("documentId", documentId).replace("fileName", fileName);
        // console.log(url);
        axios({
            method: 'get',
            url,
            auth: config.sidfAuthentication
            // headers: {
            //     'Content-Type': 'application/json;charset=UTF-8'
            // }
        })
            .then(function (response) {
                // console.log(response);
                res.send({ MessType: 'S', error: false, result: response.data });
            })
            .catch(function (error) {
                console.log(error)
                res.json({ MessType: 'E', error: true, message: "Error while downloading document" });
            });

    });
    
router.post("/getDocumentDownloadUrl",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        try {

            res.json({ MessType: 'S', error: false, MessText: "Success", documentDownloadUrl: documentDownloadUrl });

        } catch (err) {

            res.json({ MessType: 'E', error: true, MessText: "Getting Document Download Public URL !" });

        }

    });

module.exports = router;