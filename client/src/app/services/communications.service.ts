import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { _ } from 'underscore';

@Injectable({
  providedIn: 'root',
})

export class CommunicationsService {

  constructor(private http: HttpClient) { }

  validateLandLoanAdminLogin(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/communications/validateLandLoanAdminLogin', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  GetRequestsStatusByNationalIdAndServiceId(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/communications/GetRequestsStatusByNationalIdAndServiceIds', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  GetRequestsStatusByNationalId(obj) {

    return new Promise((resolve, reject) => {
      this.http.post('/api/communications/GetRequestsStatusByNationalId', obj).subscribe(
        (res: any) => {
          return resolve(res);
        },
        err => reject(err),
      );
    });
  }

  getSendRequestInfo(customerProfileId, requestType, serviceId = null,productType="A") {
    // console.log(customerProfileId);
   
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getSendRequest', {
          customerProfileId: customerProfileId,
          requestType: requestType,
          serviceId: serviceId,
          productType:productType
        })
        .subscribe(
          (res: any) => {

            if (res.MessType == 'E')
              return resolve(res);

            else {

              const resDesc = _.sortBy(res, 'RequestId').reverse()
              return resolve(resDesc);

            }

          },
          err => reject(err),
        );
    });
  }

  saveDashBoardFeedback(rating, comments) {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/postDashBoardFeedback', {
          rating: rating,
          comments: comments,
          landLoanFlag:"X"

        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getDashBoardFeedback() {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getDashBoardFeedback', {
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getMyCasesMaster() {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getMyCasesMaster', {
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  getCommunReceivedRequests(customerProfileId) {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getCommunReceivedRequests', {
          customerProfileId: customerProfileId,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  
  getPrevPRQLoanDetForCopy(customerProfileId) {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getPrevPRQLoanDetForCopy', {
          customerProfileId: customerProfileId,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }
  getLicDetBasedOnPrevReq(prevReqId:any) {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getLicDetBasedOnPrevReq', {
          prevReqId: prevReqId,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }


  getReceivedRequestCommMess(customerProfileId) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getReceivedRequestCommMess', {
          customerProfileId: customerProfileId,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getReceivedRequest(customerProfileId) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getReceivedRequest', {
          customerProfileId: customerProfileId,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  postReceivedRequest(data_temp) {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/postReceivedRequest', {
          data_temp: data_temp,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  postReceivedRequestCommMess(project_id, comments_text, request_type, cust_prof_id) {
    // console.log(customerProfileId);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/postReceivedRequestCommMess', {
          project_id: project_id,
          comments_text: comments_text,
          request_type: request_type,
          cust_prof_id: cust_prof_id,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  uploadDocumentService(files, finputJson) {
    // console.log(customerProfileId);
    //alert(files.length)
    const status = this.validateFiles(files, finputJson.operationType);
    const size = finputJson.operationType == 'p' ? 5 : 100;
    // console.log(status);
    if (status) {
      const res = { MessType: 'E', error: true, message: 'Please upload valid file and the file size must be less than ' + size + ' mb.' };
      return new Promise((resolve, reject) => {
        return resolve(res);
      });
    } else {
      const formdata: FormData = new FormData();
      for (let x = 0; x < files.length; x++) {
        formdata.append('content', files[x]);
      }
      formdata.append('documentDefId', finputJson.documentDefId);
      formdata.append('entityId', finputJson.entityId);
      formdata.append('entityName', finputJson.entityName);
      formdata.append('RelatedEntityId', finputJson.RelatedEntityId);
      formdata.append('RelatedEntityName', finputJson.RelatedEntityName);
      formdata.append('operationType', finputJson.operationType);
      formdata.append('exitDocumentId', finputJson.exitDocumentId == undefined ? 0 : finputJson.exitDocumentId);
      return new Promise((resolve, reject) => {
        this.http
          .post('/api/commonDocumentUpload/uploadDocuments', formdata)
          .subscribe(
            (res: any) => {
              return resolve(res);
            },
            err => reject(err),
          );
      });

    }
  }

  validateFiles(files, operationType) {
    let status = false;
    const size = operationType == 'p' ? 5 : 100;
    const maxFileSIze = size * 1024 * 1024 * 1024;
    /// go through the list of files
    for (let i = 0, file; file = files[i]; i++) {
      const sFileName = file.name;
      const sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
      const iFileSize = file.size;

      // alert(maxFileSIze+","+iFileSize);
      // var iConvert = (file.size / 104857600).toFixed(2);

      /// OR together the accepted extensions and NOT it. Then OR the size cond.
      /// It's easier to see this way, but just a suggestion - no requirement.
      // console.log(sFileExtension);
      if (sFileExtension === 'exe' ||
        sFileExtension === 'dll' ||
        sFileExtension === 'js' || iFileSize > maxFileSIze) { /// 100 mb
        status = true;
        return status;
      }
    }
    return status;
  }

  uploadSignUpDocumentService(files, finputJson) {
    // console.log(customerProfileId);
    //alert(files.length)
    const formdata: FormData = new FormData();
    for (let x = 0; x < files.length; x++) {
      formdata.append('content', files[x]);
    }
    formdata.append('documentDefId', finputJson.documentDefId);
    formdata.append('entityId', finputJson.entityId);
    formdata.append('entityName', finputJson.entityName);
    formdata.append('RelatedEntityId', finputJson.RelatedEntityId);
    formdata.append('RelatedEntityName', finputJson.RelatedEntityName);
    formdata.append('operationType', finputJson.operationType);
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/commonDocumentUpload/signUpUploadDocuments', formdata)
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });

  }

  getDocumentService(entityId, operationType) {
    // console.log(customerProfileId);
    //alert(files.length)
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/commonDocumentUpload/getDocumentsByEntityId', {
          entityId: entityId,
          operationType: operationType,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  deleteDocumentService(finputJson) {
    // console.log(customerProfileId);
    //alert(files.length)
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/commonDocumentUpload/deleteDocument', {
          entityId: finputJson.entityId,
          refId: finputJson.refId,
          documentId: finputJson.documentId,
          operationType: finputJson.operationType,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }



  downloadDocumentService(entityId, refId, documentId, operationType, fileName) {
    // console.log(customerProfileId);
    //alert(files.length)
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/commonDocumentUpload/downloadDocument', {
          entityId: entityId,
          refId: refId,
          documentId: documentId,
          operationType: operationType,
          fileName: fileName,
        })
        .subscribe(
          (res: any) => {
            // const blob = new Blob([res.result], { type: 'application/octet-stream' });

            // var fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getCRMSurveyURL() {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getCRMSurveyURL', {
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getAllComplaints(customerProfileId) {
    return new Promise((resolve, reject) => {
      this.http
        .post('/api/communications/getAllComplaints', {
          customerProfileId: customerProfileId,
        })
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });
  }

  getDocumentDownloadUrl() {

    return new Promise((resolve, reject) => {

      this.http
        .post('/api/commonDocumentUpload/getDocumentDownloadUrl', {})
        .subscribe(
          (res: any) => {
            return resolve(res);
          },
          err => reject(err),
        );
    });

  }

}
