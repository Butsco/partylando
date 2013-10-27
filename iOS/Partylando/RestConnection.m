//
//  RestConnection.m
//  Partylando
//
//  Created by Roberto Dries on 27/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "RestConnection.h"
#import "Item.h"

#define serverUrl "http://localhost:3000/api/%@"

typedef enum{
     dataTypeRooms=0,
     dataTypeItems=1
}dataTypes;

@implementation RestConnection

static id _delegate;
static NSMutableData *loadData;

+(void)setDelegate:(id)delegate{
    _delegate = delegate;
}
+(void)loadItems:(id)delegate{
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@serverUrl,@"zalando/top"]];
    [self load:delegate url:url suffix:@"top"];
    url = [NSURL URLWithString:[NSString stringWithFormat:@serverUrl,@"zalando/bottom"]];
    [self load:delegate url:url suffix:@"bottom"];
    url = [NSURL URLWithString:[NSString stringWithFormat:@serverUrl,@"zalando/shoes"]];
    [self load:delegate url:url suffix:@"shoes"];
    
}
+(void)loadRooms:delegate{
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@serverUrl,@"rooms"]];
    [self load:delegate url:url suffix:@"rooms"];
}

+ (void)load:(id)delegate url:(NSURL *)url suffix:(NSString*)suffix{
    _delegate =delegate;
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_HIGH, 0),^{
        NSMutableURLRequest *request = [[NSMutableURLRequest alloc]initWithURL:url];
        [request setHTTPMethod:@"GET"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
        [request setValue:@"application/json" forHTTPHeaderField:@"Accept"];
        
        
        loadData = [[NSMutableData alloc]init];
        
        [NSURLConnection sendAsynchronousRequest:request queue:[NSOperationQueue mainQueue] completionHandler:^(NSURLResponse *response, NSData *data, NSError *err){
            
            [self performSelectorOnMainThread:@selector(fetchData:)
                                   withObject:@[data,url,suffix] waitUntilDone:YES];
        }];
    });
}
+ (void)fetchData:(NSArray *)package{
    if(![package objectAtIndex:0]){
        [_delegate connectionFailed];
        return;
    }
    
    //NSDictionary * json = [NSJSONSerialization JSONObjectWithData:[package objectAtIndex:0] options:kNilOptions error:nil];
    
    
    NSString *str = [package objectAtIndex:2];
    if([str isEqualToString:@"rooms"]){
        [self RoomsParser:[package objectAtIndex:0]];
    }else if([str isEqualToString:@"top"] || [str isEqualToString:@"bottom"] ||[str isEqualToString:@"shoes"]){
        [self ItemsParser:[package objectAtIndex:0] AndKey:str];
    }
    else{
        [_delegate connectionFailed];
        }
    
    if([_delegate respondsToSelector:@selector(finishedLoading)])
        [_delegate finishedLoading];
}

+ (void)RoomsParser:(NSData *)response{
    NSError * error;
    NSDictionary * json = [NSJSONSerialization JSONObjectWithData:response options:kNilOptions error:&error];
    if(json.count==0)
        [_delegate connectionFailed];
    
    PartyData *data = [PartyData sharedInstance];
    
    NSDictionary *room = [json objectForKey:@"butsco"];
    //NSArray *participants = [[json objectForKey:@"butsco"] objectForKey:@"participants"];
    PartyRoom *r = [[PartyRoom alloc]init];
    r.name = @"butsco";
    for(NSDictionary *participant in [[json objectForKey:@"butsco"] objectForKey:@"participants"]){
        UserProfile *user = [[UserProfile alloc]init];
        //user.name =  [[room objectForKey:@"participants"] objectForKey:participant];
        user.name = [participant objectForKey:@"id"];
        user.userPartyData = [participant objectForKey:@"clothing"];
        [r.participants addObject:user];
    }
    [data.rooms addObject:r];
    data.room = r;
}
+ (void)ItemsParser:(NSData *)response AndKey:(NSString*)key{
    NSError * error;
    NSArray * json = [NSJSONSerialization JSONObjectWithData:response options:kNilOptions error:&error];
    
    json = [json objectAtIndex:0];
    NSMutableDictionary *zalando = [Item zalandoData];
    for (int i=0;i<json.count; i++) {
        NSMutableArray *dicArr = [[NSMutableArray alloc]init];
            for (NSDictionary *item in json) {
                Item *product = [[Item alloc]init];
                product.name = [item objectForKey:@"name"];
                product.price = [item objectForKey:@"price"];
                product.SKU = [item objectForKey:@"sku"];
                [product setItemImage:[item objectForKey:@"imageUrl"]];
                //product.image = [item objectForKey:@""];
                [dicArr addObject:product];
            }
        [zalando setObject:dicArr forKey:key];
    }
    
    
}
@end
