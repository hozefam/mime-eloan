import { Component, OnInit, Injectable} from '@angular/core';
import { NgbDateStruct, NgbCalendar, NgbCalendarIslamicCivil, NgbDatepickerI18n} from '@ng-bootstrap/ng-bootstrap';

const WEEKDAYS = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];
// const MONTHS = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال',
//   'ذو القعدة', 'ذو الحجة'];
const MONTHS = ['Muharram', 'Safar', 'Rabi\' I', 'Rabi\' al Thani', 'Jumada I', 'Jumada al-akhir', 'Rajab', 'Sha\'aban', 'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'];


@Injectable()
  export class IslamicI18n extends NgbDatepickerI18n {

    getWeekdayShortName(weekday: number) {
      return WEEKDAYS[weekday - 1];
    }

    getMonthShortName(month: number) {
      return MONTHS[month - 1];
    }

    getMonthFullName(month: number) {
      return MONTHS[month - 1];
    }

    getDayAriaLabel(date: NgbDateStruct): string {
      return `${date.day}-${date.month}-${date.year}`;
    }
}

@Component({
  selector: 'hijri-custom',
  templateUrl: './hijri-custom.component.html',
  styleUrls: ['./hijri-custom.component.scss'],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarIslamicCivil},
    {provide: NgbDatepickerI18n, useClass: IslamicI18n},
  ],
})
export class HijriCustomComponent implements OnInit {


  constructor(private calendar: NgbCalendar) {
    this.model = this.calendar.getToday();
    this.minDate = {year: this.model.year - 100, month: 1, day: 1};
    this.maxDate = {year: this.model.year + 20, month: 12, day: 31};
  }

  model: NgbDateStruct;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;

  ngOnInit() {
  }

  // selectToday() {
  //   this.model = this.calendar.getToday();
  // }

}
