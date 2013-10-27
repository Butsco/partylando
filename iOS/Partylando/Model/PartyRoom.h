//
//  PartyRoom.h
//  Partylando
//
//  Created by Roberto Dries on 27/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface PartyRoom : NSObject

@property (nonatomic,strong) NSString *name;
@property (nonatomic,strong) NSString *dressCode;
@property (nonatomic,strong) NSMutableArray *participants;

@end
