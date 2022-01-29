
export class RCJInformation {
    id: number;
    sysUserServiceId: number;
    WebSite: string;
    Province: string;
    BusinessNationality: string;
    BusinessWebSite: string;
    Position: string;
    InvesterTelephone: number;
    Ext: number;
    Mobile: number;
    Location: string;
    ProjectClassification: string;
    TotalAreaRequired: number;
    Power: number;
    PotableWater: number;
    SanitaryWasteWater: string;
    MunicipalWaste: string;
    HazardousWaste: string;
    IndustrialNonHazWaste: string;
    ConceptualSitePlan: string;
    ConceptualSitePlanType: string;
    MaterialLaf: string;
    Source: string;
    RCJ_Material: any[];
    RCJ_ProductServices: any[];
    constructor()
    constructor(sysUserServiceId?: number) {
        this.sysUserServiceId = sysUserServiceId;
    }

    // getPropType(propName: string){ 
    //     type type  = RCJInformation[propName];  
    // }
}