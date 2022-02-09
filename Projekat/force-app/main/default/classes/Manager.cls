public with sharing class Manager {

    @AuraEnabled
    public static String getAllProducts(String s, List<String> listOfSubtypes) {
        if(s=='desc')
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Subtype__c, Type__c, Rating__c
                                FROM Product2 
                                WHERE Quantity__c>0 AND  Subtype__c IN :listOfSubtypes
                                ORDER BY Price__c DESC NULLS LAST]);
        if(s=='asc')
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Subtype__c, Type__c, Rating__c
                                FROM Product2 
                                WHERE Quantity__c>0 AND  Subtype__c IN :listOfSubtypes
                                ORDER BY Price__c ASC NULLS FIRST]);
        if(s=='ascnum')
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Number_of_views__c, Subtype__c, Type__c, Rating__c
                                FROM Product2 
                                WHERE Quantity__c>0 AND  Subtype__c IN :listOfSubtypes
                                ORDER BY Number_of_views__c ASC NULLS FIRST]);
        if(s=='descnum')
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Number_of_views__c, Subtype__c, Type__c, Rating__c
                                FROM Product2 
                                WHERE Quantity__c>0 AND  Subtype__c IN :listOfSubtypes
                                ORDER BY Number_of_views__c DESC NULLS LAST]);
        if(s=='rating')
        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Number_of_views__c, Subtype__c, Type__c, Rating__c
                                FROM Product2 
                                WHERE Quantity__c>0 AND  Subtype__c IN :listOfSubtypes
                                ORDER BY Rating__c DESC NULLS LAST]);

        return JSON.serialize([ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Subtype__c, Type__c, Rating__c
                                FROM Product2 
                                WHERE Quantity__c>0 AND  Subtype__c IN :listOfSubtypes]);
    } 

    @AuraEnabled
    public static String getCart() {
        return JSON.serialize([ SELECT Id,Name, Price__c, Product__c, User__c, Num__c FROM Purchase__c  WHERE User__c=:UserInfo.getUserID() AND Purchased__c=false]);
    }

    @AuraEnabled
    public static String getAllPurchases() {
        return JSON.serialize([ SELECT Id,Name, Price__c, Product__c, User__c, Num__c, LastModifiedDate FROM Purchase__c  WHERE User__c=:UserInfo.getUserID() AND Purchased__c=true ORDER BY LastModifiedDate DESC NULLS LAST]);
    }

    @AuraEnabled
    public static String[] getOneProduct(String idDetail) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Rating__c, DisplayUrl, Subtype__c, Type__c
                            FROM Product2 
                            WHERE Id=:idDetail];
                            
        if(l1.size()>0){
            List<Review__c> l2= [SELECT Id, Product__c, Name, Rating__c, User__c, Comment__c FROM Review__c  WHERE User__c=:UserInfo.getUserID() AND Product__c=:l1[0].id];
            if(l2.size()>0)
                return new String[]{JSON.serialize(l1[0]),JSON.serialize(l2[0])};
            else
                return new String[]{JSON.serialize(l1[0]),'null'};
        }
        else
            return new String[]{'null', 'null'};
    } 

    @AuraEnabled
    public static void addView(String idDetail) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Rating__c, DisplayUrl, Number_of_views__c, Subtype__c, Type__c
                            FROM Product2 
                            WHERE Id=:idDetail];
        if(l1.size()==1){
            if(l1[0].Number_of_views__c!=null)
                l1[0].Number_of_views__c++;
            else
                l1[0].Number_of_views__c=1;
            update l1;
        }
    } 

    @AuraEnabled
    public static String getProducts(String idDetail, Integer num, String subtype, String type, Decimal price) {
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Rating__c, DisplayUrl, Subtype__c, Type__c
                            FROM Product2 
                            WHERE Id!=:idDetail AND Subtype__c = :subtype AND Quantity__c>0];
        if(l1.size()==0)
                        l1=[SELECT Id, Name, Description, Price__c, Quantity__c, Color__c, Rating__c, DisplayUrl, Subtype__c, Type__c
                            FROM Product2 
                            WHERE Id!=:idDetail AND Type__c = :type AND Quantity__c>0];
        Decimal p=99999999999999.9;
        List<Product2> l2 = new List<Product2>();
        Product2 p2 =  new Product2();
        for(Integer i=0; i<l1.size(); i++){
            Decimal m=l1[i].Price__c;
            if(l1[i].Price__c==null)
                m=0.0;
            if(math.abs(m-price)<=p){
                p=math.abs(m-price);
                p2=l1[i];
            }
        }
        
        l2.add(p2);
        return JSON.serialize(l2);
    } 

    @AuraEnabled
    public static void buyProducts(List<String> ids, Map<String, Integer> num) {
        System.debug(num);
        List<Product2> l1=[ SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Subtype__c, Type__c
                                FROM Product2 
                                WHERE id IN :ids];

        List<Purchase__c> l2=new List<Purchase__c>();
                                
        Map<String,Purchase__c> searchMap = new Map<String,Purchase__c>();
        for(Purchase__c p :[ SELECT Id, Price__c, Name, Product__c, User__c, Num__c FROM Purchase__c  WHERE Product__c IN :ids AND User__c=:UserInfo.getUserID() AND Purchased__c=false])
        {
            if(!searchMap.containsKey(p.Product__c)){
                searchMap.put(p.Product__c,p);
            }
        }

        if(l1.size()>0){
            for(Product2 p : l1)
            {
                if(searchMap.containsKey(p.Id)){
                    Purchase__c pc=  searchMap.get(p.Id);
                    if( (pc.Num__c+num.get(p.Id)) <=p.Quantity__c){
                        pc.Num__c+=num.get(p.Id);
                        pc.Price__c=p.Price__c;
                        pc.Name=p.Name;
                        l2.add(pc);
                    }
                    else{
                        pc.Num__c=p.Quantity__c;
                        pc.Price__c=p.Price__c;
                        pc.Name=p.Name;
                        l2.add(pc);
                    }
                }
                else {
                    Purchase__c pc=new Purchase__c();
                    pc.User__c=UserInfo.getUserID();
                    pc.Num__c=num.get(p.Id);
                    pc.Product__c=p.Id;
                    pc.Name=p.Name;
                    pc.Price__c=p.Price__c;
                    //searchMap.put(p.Id,pc);
                    l2.add(pc);
                }
            }
            upsert l2;
        }
    } 

    @AuraEnabled
    public static String finalBuy() {
        List<Purchase__c> l1=[ SELECT Id,Name, Product__c, User__c, Num__c, Purchased__c FROM Purchase__c  WHERE User__c=:UserInfo.getUserID() AND Purchased__c=false];
        List<Product2> l2=new List<Product2>();
                                
        Map<String,Product2> searchMap = new Map<String,Product2>();
        for(Product2 p :[    SELECT Id, Name, Description, Price__c, Quantity__c, DisplayUrl, Subtype__c, Type__c
                                FROM Product2 ])
        {
            if(!searchMap.containsKey(p.Id)){
                searchMap.put(p.Id,p);
            }
        }

        if(l1.size()>0){
            for(Purchase__c pc : l1)
            {
                if(searchMap.containsKey(pc.Product__c)){
                    Product2 p=  searchMap.get(pc.Product__c);
                    if(p.Quantity__c>=pc.Num__c)
                        p.Quantity__c-=pc.Num__c;
                    else{
                        pc.Num__c=p.Quantity__c;
                        p.Quantity__c=0;
                    }
                    l2.add(p);
                }
                pc.Purchased__c=true;
            }
            update l2;
            update l1;
        }
        return JSON.serialize([ SELECT Id,Name, Product__c,Price__c, User__c, Num__c FROM Purchase__c  WHERE User__c=:UserInfo.getUserID()  AND Purchased__c=false]);
    } 

    @AuraEnabled
    public static String empty(List<String> ids) {
        List<Purchase__c> l1=new List<Purchase__c>();
        if (ids.size()==0) {
            l1=[ SELECT Id,Name, Product__c, User__c, Num__c FROM Purchase__c  WHERE User__c=:UserInfo.getUserID() AND Purchased__c=false];
        }
        else {
            l1=[ SELECT Id,Name, Product__c, User__c, Num__c FROM Purchase__c  WHERE User__c=:UserInfo.getUserID() AND Purchased__c=false AND Id IN :ids];
        }
        if(l1.size()>0){
            delete l1;
        }
        return JSON.serialize([ SELECT Id,Name, Product__c,Price__c, User__c, Num__c FROM Purchase__c  WHERE User__c=:UserInfo.getUserID() AND Purchased__c=false]);
    } 

    @AuraEnabled
    public static void addReview(String idP, String n, String comment, String num) {
        List<Review__c> l1= [ SELECT Id, Product__c, Name, Rating__c, User__c, Comment__c FROM Review__c  WHERE User__c=:UserInfo.getUserID() AND Product__c=:idP];

        if(l1.size()==0){
            Review__c rew=new Review__c(Product__c=idp, Rating__c=num, Name=n, User__c=UserInfo.getUserID(), Comment__c=comment);
            insert rew;
        }
        else {
            l1[0].Rating__c=num;
            l1[0].Comment__c=comment;
            update l1;
        }
    } 
    
    @AuraEnabled
    public static String getAllReviews(String idP) {
        return JSON.serialize([ SELECT Id, Product__c, Name, Rating__c, User__r.Name, Comment__c FROM Review__c  WHERE Product__c=:idP]);
    }

    @AuraEnabled
    public static String getAllLocations() {
        String str='[{';
        for(Store__c s : [ SELECT Id, City__c, Name, Country__c, PostalCode__c, Street__c, Phone__c FROM Store__c]) {
            str+= ' \"location\": { \"City\": \"' + s.City__c + '\", \"Country\": \"' + s.Country__c + '\", \"PostalCode\": \"' + s.PostalCode__c + '\", \"Street\": \"' + s.Street__c + '\" },'+
            ' \"value\": \"' + s.Name + '\", \"description\": \"Phone number: ' + s.Phone__c + '\", \"icon\": \"standard:account\", \"title\": \"' + s.Name + '\" },{';
        }
        str = str.substring(0, str.length()-2) + ']';
        if(str==']')
            str='[]';
        return str;
    }

    @AuraEnabled
    public static String getAllLocationsForProduct(String idP) {
        List<String> l = new List<String>();
        for(Junction_Object__c j : [ SELECT Id, Product__c, Store__c FROM Junction_Object__c WHERE Product__c =: idP]) {
            l.add(j.Store__c);
        }

        String str='[{';
        for(Store__c s : [ SELECT Id, City__c, Name, Country__c, PostalCode__c, Street__c, Phone__c FROM Store__c WHERE Id IN :l]) {
            str+= ' \"location\": { \"City\": \"' + s.City__c + '\", \"Country\": \"' + s.Country__c + '\", \"PostalCode\": \"' + s.PostalCode__c + '\", \"Street\": \"' + s.Street__c + '\" },'+
            ' \"value\": \"' + s.Name + '\", \"description\": \"Phone number: ' + s.Phone__c + '\", \"icon\": \"standard:account\", \"title\": \"' + s.Name + '\" },{';
        }
        str = str.substring(0, str.length()-2) + ']';
        if(str==']')
            str='[]';
        return str;
    }
}