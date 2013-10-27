//
//  PartyItemsViewController.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "PartyItemsViewController.h"
#import "Item.h"

#define serverUrl "http://localhost:3000/%@"

@interface PartyItemsViewController ()

@end

@implementation PartyItemsViewController{
    SRWebSocket *_webSocket;
    NSMutableDictionary *userIndexForCategory;
    NSArray *categories;
    PartyData *partydata;
}
@synthesize user1 =_user1;
@synthesize user2 =_user2;

- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (void)viewDidLoad{
    [super viewDidLoad];
    partydata = [PartyData sharedInstance];
    categories = [[Item zalandoData] allKeys];
    userIndexForCategory = [[NSMutableDictionary alloc]init];
}
- (void)viewDidAppear:(BOOL)animated{
    [self reconnectSocket];
    
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    return categories.count;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    return 1;
}


-(UIView *) tableView:(UITableView *)tableView viewForHeaderInSection:(NSInteger)section{
    UILabel *title = [[UILabel alloc]initWithFrame:CGRectMake(10, 0, tableView.frame.size.width-10, 30)];
    UIView *headerView = [[UIView alloc]initWithFrame:CGRectMake(0, 0, tableView.frame.size.width, 30)];
    
    [title setFont:[UIFont boldSystemFontOfSize:15]];
    [title setTextColor:[UIColor orangeColor]];
    [title setText: [categories objectAtIndex:section]];
    
    
    [headerView setBackgroundColor:[UIColor whiteColor]];
    [headerView addSubview:title];
    
    
    return headerView;
}
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    static NSString *CellIdentifier = @"socketCell";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:CellIdentifier forIndexPath:indexPath];
    cell.tag = indexPath.section+10;
   [self addGestureRecognizerToCell:cell];
    
    CATransition *transition = [CATransition animation];
    transition.duration = 1.0f;
    transition.timingFunction = [CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionEaseInEaseOut];
    transition.type = kCATransitionFade;
    
    // Configure the cell...
    UIImageView *userImg = (UIImageView *)[cell viewWithTag:1];
    UIImageView *user1 = (UIImageView *)[cell viewWithTag:2];
    UIImageView *user2 = (UIImageView *)[cell viewWithTag:3];
    
    Item *item= [self ItemForIndex:indexPath.section inDictionary:userIndexForCategory ];
    //Item *item = [[Item zalandoData] objectForKey:_sku];
    
    
    [userImg setImage:item.image];
    [userImg.layer setBorderWidth:1];
    [userImg.layer addAnimation:transition forKey:nil];
    
    item = [self ItemForIndex:indexPath.section inDictionary:_user1];
    //item = [[Item zalandoData] objectForKey:_sku];
    [user1 setImage:item.image];
    [user1.layer setBorderWidth:1];
    [user1.layer addAnimation:transition forKey:nil];
    
    item = [self ItemForIndex:indexPath.section inDictionary:_user2];
    //item = [[Item zalandoData] objectForKey:_sku];
    [user2 setImage:item.image];
    [user2.layer setBorderWidth:1];
    [user2.layer addAnimation:transition forKey:nil];
    
    
    return cell;
}

#pragma mark - Socket rocket delegate

- (void)reconnectSocket{
    //close previous connection
    _webSocket.delegate = nil;
    [_webSocket close];
    
    //open connection
    NSString *url = [NSString stringWithFormat:@serverUrl,partydata.room.name];
    _webSocket = [[SRWebSocket alloc]initWithURLRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:url]]];
    _webSocket.delegate = self;
    [_webSocket open];
}
- (void)webSocketSendItem:(Item *)item{
    NSLog(@"Message send: %@", item);
}
- (void)webSocket:(SRWebSocket *)webSocket didReceiveMessage:(id)message{
    NSLog(@"Message received: %@",message);
    
    //verander data in user 1 & 2
    
    [self.tableView reloadData];
}
- (void)webSocketDidOpen:(SRWebSocket *)webSocket{
    NSLog(@"Socket open");
}
- (void)webSocket:(SRWebSocket *)webSocket didFailWithError:(NSError *)error{
    NSLog(@"Socket closed(%d): %@",error.code,error);
    _webSocket = nil;
}
- (void)webSocket:(SRWebSocket *)webSocket didCloseWithCode:(NSInteger)code reason:(NSString *)reason wasClean:(BOOL)wasClean{
    NSLog(@"Socket closed(%d): %@",code,reason);
    _webSocket = nil;

}
#pragma mark - data helper

-(Item *)ItemForIndex:(int)i inDictionary:(NSDictionary *)userTable {
    NSString * key = (NSString *)[categories objectAtIndex:i];
    NSArray *items = [[Item zalandoData] objectForKey:key];
    int index = [((NSNumber *)[userTable objectForKey:key]) intValue];
    if(!index)
        index = 0;
    //save
    [userIndexForCategory setObject:[NSNumber numberWithInt:index] forKey:key];
    return [items objectAtIndex:index];
}

-(int)nextSKUForIndex:(int)i inDictionary: (NSMutableDictionary *)userTable WithBool:(BOOL)increase{
    NSString * key = (NSString*)[categories objectAtIndex:i];
    NSArray *items = [[Item zalandoData] objectForKey:key];
    double index = [((NSNumber *)[userTable objectForKey:key]) doubleValue];
    if(!index)
        index = 0;
    
    if(increase){
        index++;
    }else{
        index--;
    }
    
    if(index>=items.count){
        index=0;
    }
    
    if(index<0){
        index=items.count-1;
    }
    
    [userTable setObject:[NSNumber numberWithDouble:index] forKey:key];
    return index;
}
#pragma mark - gesture recognizer
- (void) addGestureRecognizerToCell:(UITableViewCell*) cell{
    UISwipeGestureRecognizer* rightSwipe = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(rightSwipeHandle:)];
    UISwipeGestureRecognizer* leftSwipe = [[UISwipeGestureRecognizer alloc] initWithTarget:self action:@selector(leftSwipeHandle:)];
    
    rightSwipe.direction = UISwipeGestureRecognizerDirectionRight;
    leftSwipe.direction = UISwipeGestureRecognizerDirectionLeft;
    [rightSwipe setNumberOfTouchesRequired:1];
    [leftSwipe setNumberOfTouchesRequired:1];
    
    [cell addGestureRecognizer:rightSwipe];
    [cell addGestureRecognizer:leftSwipe];
}

- (void)rightSwipeHandle:(UISwipeGestureRecognizer *)gestureRecognizer{
    int i = [self nextSKUForIndex:((int)gestureRecognizer.view.tag)-10 inDictionary:userIndexForCategory WithBool:YES];
    [self syncData];
    NSLog(@"right swipe - index %d",i);

}
- (void)leftSwipeHandle:(UISwipeGestureRecognizer *)gestureRecognizer{
    int i = [self nextSKUForIndex:((int)gestureRecognizer.view.tag)-10 inDictionary:userIndexForCategory WithBool:NO];
    [self syncData];
    NSLog(@"right swipe - index %d",i);

}

- (void)syncData{
    [self.tableView reloadData];
    [self webSocketSendItem:[Item new]];
    NSLog(@"%@",userIndexForCategory);
}
@end