import { Component, Input, AfterViewInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonCommentsService } from '../../services/common-comments.service';
import { CustomerProfileService } from '../../services/customer-profile.service';
import { CommunicationsService } from '../../services/communications.service';

@Component({
  selector: 'common-comments',
  templateUrl: './common-comments.component.html',
  styleUrls: ['./common-comments.component.scss'],
})

export class CommonCommentsComponent implements AfterViewInit {

  configForCkEditor = {};

  files: any = [];

  documentIndex = 0;

  documentNames = [];

  documentIds = [];

  @Input() comments: any;

  translate: any;

  modalReference: any = [];

  currentComment = '';

  documentDownloadUrl = '';

  documentStruc;

  constructor(private communicationsService: CommunicationsService, private spinnerService: Ng4LoadingSpinnerService, private customerProfileService: CustomerProfileService,
    public commonService: CommonService, private modalService: NgbModal, private commonCommentsService: CommonCommentsService) {
    this.configForCkEditor = this.commonService.configForCkEditor;
    this.translate = this.commonService.returnTranslate();

  }

  ngOnInit() {

    this.communicationsService
      .getDocumentDownloadUrl()
      .then((res) => (this.resolveDocumentDownloadUrl(res)), err => this.resolveError());
  }

  resolveDocumentDownloadUrl(res) {

    if (res.MessType == 'S') {

      this.documentDownloadUrl = res.documentDownloadUrl;

      this.comments = this.comments;

    }

  }

  ngAfterViewInit() { }

  getDocument(document) {

    // let docUrl = this.documentDownloadUrl;

    // docUrl = docUrl.replace('entityId', this.comments.commentDetails.SentReqId)
    //   .replace('refId', document.GuiId)
    //   .replace('documentId', document.FileId)
    //   .replace('fileName', document.CommentText);

    // window.open(docUrl);
    this.documentView(document);

  }

  documentView(document) {

    this.documentStruc = document;

    this.spinnerService.show();

    this.communicationsService.downloadDocumentService(this.comments.commentDetails.CommId,
      document.DefId, document.FileId, 'l', document.CommentText)
      .then(response => (this.handleFileDownload(response)), err => (this.commonService.showFailureToast(err), this.spinnerService.hide()));

  }

  handleFileDownload(res) {
    console.log("Handle File Download");

    let fileName = this.documentStruc.CommentText ? this.documentStruc.CommentText : "file";
    if (res) {
      if (res.result != undefined) {
        var buffer = this.commonService.base64ToArrayBuffer(res.result);
        this.commonService.saveByteArray([buffer], fileName);
        this.spinnerService.hide();
      }
      else {
        this.spinnerService.hide();
      }
    } else {
      this.spinnerService.hide();
    }
  }

  onSubmitComment() {

    if (this.currentComment == '')
      this.commonService.showFailureToast(this.translate.instant('COMMON.EnterCommentExcl'));

    else {

      this.spinnerService.show();

      let commentPostData: any;

      if (this.comments.commentDetails.SentReqId)
        commentPostData = {
          'RecReqComm': [
            {
              'CommId': this.comments.commentDetails.CommId,
              'SentReqId': this.comments.commentDetails.SentReqId,
              'SentReqType': this.comments.commentDetails.SentReqType,
              'SubDeadLine': this.comments.commentDetails.SubDeadLine,
              'RecReqSection': [
                {
                  'SectionId': this.comments.commentDetails.SectionId,
                  'CommId': this.comments.commentDetails.CommId,
                  'DeadLineDate': this.comments.commentDetails.DeadLineDate,
                  'ReqSec': this.comments.commentDetails.ReqSec,
                  'ReqSubSec': this.comments.commentDetails.ReqSubSec,
                  'ReqStatus': this.comments.commentDetails.ReqStatus,
                  'RecReqComment': [
                    {
                      'CommentText': this.currentComment,
                      'Indicator': 'CP',
                    },
                  ],
                },
              ],
            },
          ],
        };

      else if (this.comments.commentDetails.ClaimId)
        commentPostData = {
          'Indicator': 'COMMENT',
          'RecReqComm': [
            {
              'CommId': this.comments.commentDetails.CommId,
              'ClaimId': this.comments.commentDetails.ClaimId,
              'SentReqType': this.comments.commentDetails.SentReqType,
              'SubDeadLine': this.comments.commentDetails.SubDeadLine,
              'RecReqSection': [
                {
                  'WbsId': this.comments.commentDetails.WbsId,
                  'SectionId': this.comments.commentDetails.SectionId,
                  'CommId': this.comments.commentDetails.CommId,
                  'DeadLineDate': this.comments.commentDetails.DeadLineDate,
                  'ReqSec': this.comments.commentDetails.ReqSec,
                  'ReqSubSec': this.comments.commentDetails.ReqSubSec,
                  'ReqStatus': this.comments.commentDetails.ReqStatus,
                  'RecReqComment': [
                    {
                      'CommentText': this.currentComment,
                      'Indicator': 'CP',
                    },
                  ],
                },
              ],
            },
          ],
        }

      this.commonCommentsService.postCommonComments(commentPostData)
        .then((res) => (this.resolvePostCommonComments(res))), err => (this.commonService.showFailureToast(err), this.spinnerService.hide());

    }

  }

  resolvePostCommonComments(res) {

    if (res.MessType == 'S')
      this.updateCommonComments(res);

    else {

      this.spinnerService.hide();
      this.commonService.showFailureToast(res.MessText);

    }

  }

  updateCommonComments(res) {

    let temp_comments = {
      PrqOrLoan: this.comments.PrqOrLoan,
      SectionCode: this.comments.SectionCode,
      SubSectionCode: this.comments.SubSectionCode,
      anyOpenComments: this.comments.anyOpenComments,
      commentArray: [],
      commentDetails: this.comments.commentDetails,
      hasComments: this.comments.hasComments,
    };

    let current_comment = {
      CommentId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentId,
      CommentText: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentText,
      CommentedBy: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentedBy,
      Indicator: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].Indicator,
      SectionId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].SectionId,
      TimeStamp: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].TimeStamp,
    };

    temp_comments.commentArray.push(current_comment);

    for (let i = 0; i < this.comments.commentArray.length; i++)
      temp_comments.commentArray.push(this.comments.commentArray[i]);

    this.comments = temp_comments;


    let temp_comments_array = this.customerProfileService.commentArray;

    if (temp_comments_array.RecReqComm)
      for (let i = 0; i < temp_comments_array.RecReqComm.length; i++)
        if (temp_comments_array.RecReqComm[i].SentReqType == temp_comments.commentDetails.SentReqType &&
          temp_comments_array.RecReqComm[i].CommReqStatus == temp_comments.commentDetails.ReqStatus)
          if (temp_comments_array.RecReqComm[i].RecReqSection)
            for (let j = 0; j < temp_comments_array.RecReqComm[i].RecReqSection.length; j++)
              if (temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSec == temp_comments.commentDetails.ReqSec &&
                temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSubSec == temp_comments.commentDetails.ReqSubSec)
                temp_comments_array.RecReqComm[i].RecReqSection[j]["RecReqComment"] = temp_comments.commentArray;

    this.customerProfileService.setCommentArray(temp_comments_array);

    if (this.files.length == 0) {

      this.currentComment = '';

      this.commonService.showSuccessToast(res.MessText);

      this.spinnerService.hide();

    }

    else {

      for (let i = 0; i < this.files.length; i++)
        this.documentNames.push(this.files[i].name);

      let data = {
        documentDefId: 121,
        entityId: this.comments.commentDetails.CommId,
        entityName: 'Project',
        RelatedEntityId: '',
        RelatedEntityName: 'product',
        operationType: 'l',
      };

      this.communicationsService.uploadDocumentService(this.files, data)
        .then(requests => (this.onDocumentUpload(requests)), err => this.resolveError());

    }

  }

  onDocumentUpload(requests) {

    if (requests.MessType == 'S') {

      this.documentIndex = 0;

      for (let i = 0; i < requests.data.documentList.length; i++)
        this.documentIds.push(requests.data.documentList[i].DocumentId);

      this.onDocumentUploadResolve();

    }

    else {

      this.commonService.showFailureToast(requests.message);
      this.spinnerService.hide();

    }

  }

  onDocumentUploadResolve() {

    let commentPostData: any;

    if (this.comments.commentDetails.SentReqId)
      commentPostData = {
        'RecReqComm': [
          {
            'CommId': this.comments.commentDetails.CommId,
            'SentReqId': this.comments.commentDetails.SentReqId,
            'SentReqType': this.comments.commentDetails.SentReqType,
            'SubDeadLine': this.comments.commentDetails.SubDeadLine,
            'RecReqSection': [
              {
                'SectionId': this.comments.commentDetails.SectionId,
                'CommId': this.comments.commentDetails.CommId,
                'DeadLineDate': this.comments.commentDetails.DeadLineDate,
                'ReqSec': this.comments.commentDetails.ReqSec,
                'ReqSubSec': this.comments.commentDetails.ReqSubSec,
                'ReqStatus': this.comments.commentDetails.ReqStatus,
                'RecReqComment': [
                  {
                    'CommentText': this.documentNames[this.documentIndex],
                    'IsFile': 'X',
                    'DefId': '121',
                    'FileId': this.documentIds[this.documentIndex],
                    'Indicator': 'CP',
                  },
                ],
              },
            ],
          },
        ],
      }

    else if (this.comments.commentDetails.ClaimId)
      commentPostData = {
        'Indicator': 'COMMENT',
        'RecReqComm': [
          {
            'CommId': this.comments.commentDetails.CommId,
            'ClaimId': this.comments.commentDetails.ClaimId,
            'SentReqType': this.comments.commentDetails.SentReqType,
            'SubDeadLine': this.comments.commentDetails.SubDeadLine,
            'RecReqSection': [
              {
                'WbsId': this.comments.commentDetails.WbsId,
                'SectionId': this.comments.commentDetails.SectionId,
                'CommId': this.comments.commentDetails.CommId,
                'DeadLineDate': this.comments.commentDetails.DeadLineDate,
                'ReqSec': this.comments.commentDetails.ReqSec,
                'ReqSubSec': this.comments.commentDetails.ReqSubSec,
                'ReqStatus': this.comments.commentDetails.ReqStatus,
                'RecReqComment': [
                  {
                    'CommentText': this.documentNames[this.documentIndex],
                    'IsFile': 'X',
                    'DefId': '121',
                    'FileId': this.documentIds[this.documentIndex],
                    'Indicator': 'CP',
                  },
                ],
              },
            ],
          },
        ],
      }

    this.commonCommentsService.postCommonComments(commentPostData)
      .then((res) => (this.resolvePostCommonCommentsDocuments(res))), err => (this.commonService.showFailureToast(err), this.spinnerService.hide());

  }

  resolvePostCommonCommentsDocuments(res) {

    if (res.MessType == 'S')
      this.updateCommonCommentsDocuments(res);

    else {

      this.spinnerService.hide();
      this.commonService.showFailureToast(res.MessText);

    }

  }

  updateCommonCommentsDocuments(res) {

    let temp_comments = {
      PrqOrLoan: this.comments.PrqOrLoan,
      SectionCode: this.comments.SectionCode,
      SubSectionCode: this.comments.SubSectionCode,
      anyOpenComments: this.comments.anyOpenComments,
      commentArray: [],
      commentDetails: this.comments.commentDetails,
      hasComments: this.comments.hasComments,
    };

    let current_comment = {
      CommentId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentId,
      CommentText: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentText,
      CommentedBy: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].CommentedBy,
      Indicator: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].Indicator,
      SectionId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].SectionId,
      IsFile: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].IsFile,
      DefId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].DefId,
      FileId: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].FileId,
      TimeStamp: res.RecReqComm[0].RecReqSection[0].RecReqComment[0].TimeStamp,
    };

    temp_comments.commentArray.push(current_comment);

    for (let i = 0; i < this.comments.commentArray.length; i++)
      temp_comments.commentArray.push(this.comments.commentArray[i]);

    this.comments = temp_comments;


    let temp_comments_array = this.customerProfileService.commentArray;

    for (let i = 0; i < temp_comments_array.RecReqComm.length; i++)
      if (temp_comments_array.RecReqComm[i].SentReqType == temp_comments.commentDetails.SentReqType &&
        temp_comments_array.RecReqComm[i].CommReqStatus == temp_comments.commentDetails.ReqStatus)
        for (let j = 0; j < temp_comments_array.RecReqComm[i].RecReqSection.length; j++)
          if (temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSec == temp_comments.commentDetails.ReqSec &&
            temp_comments_array.RecReqComm[i].RecReqSection[j].ReqSubSec == temp_comments.commentDetails.ReqSubSec)
            temp_comments_array.RecReqComm[i].RecReqSection[j].RecReqComment = temp_comments.commentArray;

    this.customerProfileService.setCommentArray(temp_comments_array);

    this.documentIndex++;

    if (this.documentIndex < this.files.length)
      this.onDocumentUploadResolve();

    else {

      this.currentComment = '';

      this.files = [];

      (<HTMLInputElement>document.getElementById('fileUpload')).value = '';

      this.commonService.showSuccessToast(res.MessText);

      this.spinnerService.hide();

    }

  }

  onFileChange(event) {

    let format;

    let format_length;

    this.files = event.target.files;

    for (let i = 0; i < this.files.length; i++) {

      format = this.files[i].name.split('.');

      format_length = format.length;
      //5242880 - 5 Mb - 5 * 1024 * 1024 = 5242880
      //11Mb - 11534336
      if (this.files[i].size > this.commonService.documentSizeLimits.documentSize5MB) {

        this.commonService.showFailureToast(this.translate.instant('COMMON.Thesizeofeachchosenfileshouldbeamaximumof5MB!'));
        event.target.value = '';

        this.files = [];

        break;

      }

      else if (format[format_length - 1] === 'exe' || format[format_length - 1] === 'dll' || format[format_length - 1] === 'js') {

        this.commonService.showFailureToast(this.translate.instant('COMMON.FormatOfFile'));
        event.target.value = '';

        this.files = [];

        break;

      }

    }

  }

  onCommonCommentClick(event) {

    if (this.comments.hasComments)
      this.modalReference = this.modalService.open(event, this.commonService.modalOptions);

    else
      this.commonService.showFailureToast(this.translate.instant('COMMON.SubsectionHasNoComments'));

  }

  closeModal() {
    this.modalReference.close();
  }

  resolveError() {

    this.spinnerService.hide();
    this.commonService.showFailureToast(this.translate.instant('COMMON.SomethingWentWrong'));

  }

}
