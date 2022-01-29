export class RCYInvesterInformation {
    Email: string;
    sysUserServiceId: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    City: string;
    POBox: string;
    Nationality: string;
    NationalId: string;
    Phone: string;
    Mobile: string;
    ComapnyName1025: string;
    CommercialId: string;
    JobTitle: string;
    WaselNumber: string;
    RegNumber: string;
    RegActivity: string;
    FullName_ENG: string;

    constructor()
    constructor(sysUserServiceId?: number) {
        this.sysUserServiceId = sysUserServiceId;
    }
}
    // getPropType(propName: string){
    //     type type  = RCJInformation[propName];  
    // }
