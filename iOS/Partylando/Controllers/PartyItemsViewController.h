//
//  PartyItemsViewController.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <SocketRocket/SRWebSocket.h>

@interface PartyItemsViewController : UITableViewController <SRWebSocketDelegate>
@property (nonatomic,strong) NSMutableDictionary *user1;
@property (nonatomic,strong) NSMutableDictionary *user2;
@end
