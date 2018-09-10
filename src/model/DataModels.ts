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
    uid: String;
}


export interface contactUs {
    message: String;
    info: String;
}

export interface notifi {
    title: String;
    body: String;
    key: String;
    isRead: Boolean;
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