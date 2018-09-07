export interface UserDataModel {
    uid: any;
    name: String;
    province: String;
    zone: String;
    userType: String;
    pharmacyReplyNo: String;
    pharmacyAdress: String;
}

export interface pharmacyList {
    id: String;
    hybridKey: String;
    userData: Array<UserDataModel>;
}

export interface hybridLogin {
    id: String;
    key: String;
}

export interface postModel {
    name: String;
    uidUser: String;
    postBody: String;
    postImg: String;
    postDate: String;
    comments: Array<replyModel>;
}

export interface replyModel {
    pharmacyName: String;
    pharmacyKey: any;
    date: String;
    price: String;
    details: String;
}