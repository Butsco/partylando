//
//  PartyData.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "UserProfile.h"
#import "PartyRoom.h"

@interface PartyData : NSObject

@property (nonatomic,strong) NSMutableArray *rooms;
@property (nonatomic,strong) NSMutableArray *parties;

@property (nonatomic,strong) PartyRoom *room;
@property (nonatomic,strong) UserProfile *user;



//singleton
+(PartyData *)sharedInstance;

@end
