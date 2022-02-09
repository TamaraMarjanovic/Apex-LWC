trigger ChangeRatingTrigger on Review__c (after insert, after update) {
        
    if (Trigger.isInsert) {
        List<String> ids = new List<String>();
        for(Review__c r : Trigger.New){
            ids.add(r.Product__c);
        }
        Map<String,Product2> searchMap1 = new Map<String,Product2>();
        for(Product2 p :[SELECT Id, Rating__c, RatingNum__c FROM Product2 WHERE Id IN :ids])
        {
            if(!searchMap1.containsKey(p.Id))
                searchMap1.put(p.Id,p);
        }

        list<Product2> updatelist = new List<Product2>();
        for(Review__c r : Trigger.New){
            if(searchMap1.containsKey(r.Product__c)){
                Product2 p=searchMap1.get(r.Product__c);
                if(p.RatingNum__c==null)
                     p.RatingNum__c=1;
                else
                    p.RatingNum__c++;
                p.Rating__c=(Integer.valueOf(p.Rating__c)*(p.RatingNum__c-1)+Integer.valueOf(r.Rating__c))/p.RatingNum__c;
                updatelist.add(p);
            }
        }

        if(updatelist.size()>0)
            update updatelist; 
    }
    if (Trigger.isUpdate) {
        List<String> ids = new List<String>();
        for(Review__c r : Trigger.New){
            ids.add(r.Product__c);
        }
        
        list<Product2> updatelist = new List<Product2>();
        for(Product2 p :[SELECT Id, Rating__c, RatingNum__c FROM Product2 WHERE Id IN :ids])
        {
            AggregateResult[] groupedResults = [SELECT Id, AVG(Rew__c) avg FROM Review__c  WHERE Product__c=:p.Id GROUP BY Id];
            Double avg = (Double)(groupedResults[0].get('avg')); 
            p.Rating__c=avg;
            updatelist.add(p);
        }

        if(updatelist.size()>0)
            update updatelist;
    }
}