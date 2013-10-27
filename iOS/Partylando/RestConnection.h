//
//  RestConnection.h
//  Partylando
//
//  Created by Roberto Dries on 27/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <Foundation/Foundation.h>
@protocol RestDelegate

@optional - (void)finishedLoading;
@required - (void)connectionFailed;

@end
@interface RestConnection : NSObject

+ (void)setDelegate: (id)delegate;
+ (void)loadItems: (id)delegate;
+ (void)loadRooms: (id)delegate;

@end

