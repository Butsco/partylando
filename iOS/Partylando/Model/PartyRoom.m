//
//  PartyRoom.m
//  Partylando
//
//  Created by Roberto Dries on 27/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "PartyRoom.h"

@implementation PartyRoom
- (id)init
{
    self = [super init];
    if (self) {
        self.participants = [[NSMutableArray alloc]init];
        self.dressCode = @"Fancy";
    }
    return self;
}
@end
