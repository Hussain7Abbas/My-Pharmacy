export interface UserDataModel {
    uid: any;
    name: string;
    province: string;
    zone: string;
    userType: string;
    pharmacyReplyNo: string;
    pharmacyAdress: string;
}

export interface postModel {
    name: string;
    uidUser: string;
    postBody: string;
    postImg: string;
    postDate: string;
    comments: Array<replyModel>;
}

export interface replyModel {
    pharmacyName: string;
    pharmacyKey: any;
    date: string;
    price: string;
    details: string;
}