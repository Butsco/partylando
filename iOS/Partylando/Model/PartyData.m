//
//  PartyData.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "PartyData.h"
#import "UserProfile.h"
@interface PartyData()

@end

@implementation PartyData

static PartyData *partyData;

+(PartyData *)sharedInstance{
    if(!partyData){
        partyData = [[super allocWithZone:NULL] init];
        partyData.rooms = [[NSMutableArray alloc]init];
        partyData.parties = [[NSMutableArray alloc]init];
        partyData.user = [[UserProfile alloc]init];
        partyData.room = [[PartyRoom alloc]init];
    }
    return partyData;
}
- (NSString *)jsonForUser{
    //dictionary
    //
    //room
    //id - naam
    //obj - clothing
    //top (1) - bottom(1) - shoes(1)
    
    NSMutableDictionary *item = [NSMutableDictionary dictionaryWithObjectsAndKeys:
                                 self.room.name,@"room",
                                 self.user.name,@"id",
                                 [self.user JSONForUserItems],@"clothing", nil];
    //parse to Json
    NSData *json = [NSJSONSerialization dataWithJSONObject:item options:NSJSONWritingPrettyPrinted error:nil];
    NSLog(@"%@",[json description]);
    
    return [json description];
}
@end
