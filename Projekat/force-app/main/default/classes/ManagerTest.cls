@isTest
public with sharing class ManagerTest {

    @TestSetup
    static void makeData() {
    
        Product2 p = new Product2();
        p.Name = 'Lenovo';
        p.Color__c = 'blue';
        p.Number_of_views__c = 0;
        p.Price__c= 150000;
        p.Quantity__c = 12;
        p.Rating__c=0;
        p.RatingNum__c=0;
        p.Subtype__c='TV';
        p.Type__c='TV, Audio, Video';
        insert p;
        
        Product2 p1 = new Product2();
        p1.Name = 'Lenovo1';
        p1.Color__c = 'green';
        p1.Number_of_views__c = 0;
        p1.Price__c= 150050;
        p1.Quantity__c = 12;
        p1.Rating__c=0;
        p1.RatingNum__c=0;
        p1.Subtype__c='TV';
        p1.Type__c='TV, Audio, Video';
        insert p1;
        
        Purchase__c p2 = new Purchase__c();
        p2.Name = 'Lenovo1';
        p2.User__c = UserInfo.getUserID();
        p2.Purchased__c = false;
        p2.Num__c= 1;
        p2.Price__c= 150050;
        p2.Product__c = p1.Id;
        insert p2;
        
        Purchase__c p3 = new Purchase__c();
        p3.Name = 'Lenovo';
        p3.User__c = UserInfo.getUserID();
        p3.Purchased__c = true;
        p3.Num__c= 1;
        p3.Price__c= 150000;
        p3.Product__c = p.Id;
        insert p3;

        Review__c r = new Review__c();
        r.Comment__c = 'Lenovo';
        r.User__c = UserInfo.getUserID();
        r.Rating__c = '5';
        r.Product__c = p.Id;
        insert r;
        
        Store__c s = new Store__c();
        s.City__c = 'New York';
        s.Name = 'Store1';
        s.Country__c = 'USA';
        s.PostalCode__c = '10001';
        s.Street__c = '1000 5th Ave';
        s.Phone__c = '0658974569';
        insert s;
    }
        
    @isTest
    public static void getAllProductsTest(){
        List<String> l = new List<String>();
        l.add('TV');
        List<Product2> lista = (List<Product2>)JSON.deserialize( Manager.getAllProducts('desc', l), List<Product2>.class);
    	System.assertEquals(lista.size(), 2);
        List<Product2> lista1 = (List<Product2>)JSON.deserialize( Manager.getAllProducts('asc', l), List<Product2>.class);
    	System.assertEquals(lista1.size(), 2);
        List<Product2> lista2 = (List<Product2>)JSON.deserialize( Manager.getAllProducts('ascnum', l), List<Product2>.class);
    	System.assertEquals(lista2.size(), 2);
        List<Product2> lista3 = (List<Product2>)JSON.deserialize( Manager.getAllProducts('descnum', l), List<Product2>.class);
    	System.assertEquals(lista3.size(), 2);
        List<Product2> lista4 = (List<Product2>)JSON.deserialize( Manager.getAllProducts('rating', l), List<Product2>.class);
    	System.assertEquals(lista4.size(), 2);
        List<Product2> lista5 = (List<Product2>)JSON.deserialize( Manager.getAllProducts('none', l), List<Product2>.class);
    	System.assertEquals(lista5.size(), 2);
    }
       
    @isTest
    public static void getCartTest(){
        List<Purchase__c> lista = (List<Purchase__c>)JSON.deserialize( Manager.getCart(), List<Purchase__c>.class);
    	System.assertEquals(lista.size(), 1);
    }
           
    @isTest
    public static void getAllPurchasesTest(){
        List<Purchase__c> lista = (List<Purchase__c>)JSON.deserialize( Manager.getAllPurchases(), List<Purchase__c>.class);
    	System.assertEquals(lista.size(), 1);
    }

    @isTest
    public static void getOneProductTest(){
        List<Product2> l=[ SELECT Id, Name FROM Product2  WHERE Name='Lenovo'];
        String[] s = Manager.getOneProduct(l[0].Id);
        /*List<Product2> lista = (List<Product2>)JSON.deserialize( s[0], List<Product2>.class);
        List<Review__c> lista1 = (List<Review__c>)JSON.deserialize( s[1], List<Review__c>.class);
        System.assertEquals(lista.size(), 1);
        System.assertEquals(lista1.size(), 1);*/
        system.debug('t');
        
        List<Product2> l1=[ SELECT Id, Name FROM Product2  WHERE Name='Lenovo1'];
        String[] s1 = Manager.getOneProduct(l1[0].Id);
        //List<Product2> lista2 = (List<Product2>)JSON.deserialize( s1[0], List<Product2>.class);
        //System.assertEquals(lista2.size(), 1);
        System.assertEquals(s1[1], 'null');

        String[] s2 = Manager.getOneProduct('1');
        System.assertEquals(s2[0], 'null');
        System.assertEquals(s2[1], 'null');
    }

    @isTest
    public static void addViewTest(){
        List<Product2> l=[ SELECT Id, Name, Number_of_views__c  FROM Product2  WHERE Name='Lenovo'];
        System.assertEquals(l[0].Number_of_views__c, 0);
        Manager.addView(l[0].Id);
        List<Product2> l1=[ SELECT Id, Name, Number_of_views__c  FROM Product2  WHERE Name='Lenovo'];
        System.assertEquals(l1[0].Number_of_views__c, 1);
    }

    @isTest
    public static void getProductsTest(){
        List<Product2> l=[ SELECT Id, Name, Number_of_views__c, Subtype__c, Type__c, Price__c  FROM Product2  WHERE Name='Lenovo'];
        
        List<Product2> lista1 = (List<Product2>)JSON.deserialize(  Manager.getProducts(l[0].Id, 1,  l[0].Subtype__c, l[0].Type__c, l[0].Price__c), List<Product2>.class); 
        System.assertEquals(lista1.size(), 1);
        
        List<Product2> lista2 = (List<Product2>)JSON.deserialize(  Manager.getProducts(l[0].Id, 1, 'Video', l[0].Type__c, l[0].Price__c), List<Product2>.class); 
        System.assertEquals(lista2.size(), 1);
    }
    
    @isTest
    public static void  buyProductsTest(){
        List<Product2> l=[ SELECT Id, Name, Quantity__c  FROM Product2  WHERE Name='Lenovo1'];
        List<Product2> l1=[ SELECT Id, Name, Quantity__c  FROM Product2  WHERE Name='Lenovo'];
        
       	List<String> ls=new List<String>();
        ls.add(l[0].Id);
        ls.add(l1[0].Id);
        
        Map<String, Integer> m=new Map<String, Integer>();
        m.put(l[0].Id,3);
        m.put(l1[0].Id,3);
        
       	Test.startTest();
        Manager.buyProducts(ls, m); 
    	Test.stopTest();
        
        List<Purchase__c> l2=[ SELECT Id, Name, Num__c  FROM Purchase__c  WHERE Name='Lenovo1' AND Num__c=4];
        System.assertEquals(l2.size(), 1);
        
        List<Purchase__c> l3=[ SELECT Id, Name, Num__c  FROM Purchase__c  WHERE Name='Lenovo' AND Num__c=3];
        System.assertEquals(l3.size(), 1);
    }

	@isTest
    public static void  finalBuyTest(){
        List<Product2> l=[ SELECT Id, Name, Quantity__c  FROM Product2  WHERE Name='Lenovo1'];
        System.assertEquals(l[0].Quantity__c, 12);
        
       	Test.startTest();
        Manager.finalBuy(); 
    	Test.stopTest();
        
        List<Product2> l2=[ SELECT Id, Name, Quantity__c  FROM Product2  WHERE Name='Lenovo1'];
        System.assertEquals(l2[0].Quantity__c, 11);
    }
    
    @isTest
    public static void emptyTest(){
        List<Purchase__c> l=[ SELECT Id, Name, Purchased__c  FROM Purchase__c  WHERE Name='Lenovo1'];
        System.assertEquals(l.size(),1);
        
        List<String> l0=new List<String>();
       	Test.startTest();
        Manager.empty(l0); 
    	Test.stopTest();
        
        List<Purchase__c> l1=[ SELECT Id, Name, Purchased__c  FROM Purchase__c  WHERE Name='Lenovo1'];
        System.assertEquals(l1.size(),0);
    }
    
    @isTest
    public static void empty1Test(){
        List<Purchase__c> l=[ SELECT Id, Name, Purchased__c  FROM Purchase__c  WHERE Name='Lenovo1'];
        System.assertEquals(l.size(),1);
        
        List<String> l0=new List<String>();
        l0.Add(l[0].Id);
       	Test.startTest();
        Manager.empty(l0); 
    	Test.stopTest();
        
        List<Purchase__c> l1=[ SELECT Id, Name, Purchased__c  FROM Purchase__c  WHERE Name='Lenovo1'];
        System.assertEquals(l1.size(),0);
    }
    
    @isTest
    public static void addReviewTest(){
        List<Product2> lp=[ SELECT Id, Name, Quantity__c  FROM Product2  WHERE Name='Lenovo'];
        String s=lp[0].Id;

        List<Product2> lp1=[ SELECT Id, Name, Quantity__c  FROM Product2  WHERE Name='Lenovo1'];       
        String s1=lp1[0].Id;
        
       	Test.startTest();
        Manager.addReview(s1, lp1[0].Name, 'Novi kom', '3'); 
        Manager.addReview(s, lp[0].Name, 'Novi kom', '4'); 
    	Test.stopTest();
        
        List<Review__c> l1= [ SELECT Id, Product__c, Name, Rating__c, User__c, Comment__c FROM Review__c  WHERE User__c=:UserInfo.getUserID() AND Product__c=:s];
        System.assertEquals(l1.size(),1);
        
        List<Review__c> l2= [ SELECT Id, Product__c, Name, Rating__c, User__c, Comment__c FROM Review__c  WHERE User__c=:UserInfo.getUserID() AND Product__c=:s1];
        System.assertEquals(l2.size(),1);
    }   

    @isTest
    public static void getAllReviewsTest(){
        List<Product2> l=[ SELECT Id, Name, Number_of_views__c  FROM Product2  WHERE Name='Lenovo'];

        List<Review__c> lista = (List<Review__c>)JSON.deserialize( Manager.getAllReviews(l[0].Id), List<Review__c>.class);
    	System.assertEquals(lista.size(), 1);
    }
   
    //getAllLocations
    //getAllLocationsForProduct
}