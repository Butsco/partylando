//
//  loginViewController.m
//  Partylando
//
//  Created by Roberto Dries on 27/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "loginViewController.h"
#import "RestConnection.h"

@interface loginViewController ()

@end

@implementation loginViewController

@synthesize FBLoginView =_login;
@synthesize ProfilePic = _profile;


- (void)viewDidLoad
{
    [super viewDidLoad];
    [self loadData];
    _login.readPermissions = @[@"basic_info",
                               @"user_location"];
    _login.delegate=self;
}
-(void)loadData{
    [RestConnection loadRooms:nil];
    [RestConnection loadItems:nil];
}
#pragma mark - FBLoginView delegate
-(void)loginView:(FBLoginView *)loginView handleError:(NSError *)error{
    NSString *alertMessage, *alertTitle;
    alertTitle = @"error";
    if(error.fberrorShouldNotifyUser) {
        alertMessage = error.fberrorUserMessage;
    }
}
-(void)loginViewShowingLoggedInUser:(FBLoginView *)loginView{
    self.partyButton.enabled = YES;

}
-(void)loginViewShowingLoggedOutUser:(FBLoginView *)loginView{
    self.partyButton.enabled = NO;
}
-(void)loginViewFetchedUserInfo:(FBLoginView *)loginView user:(id<FBGraphUser>)user{
    PartyData *data = [PartyData sharedInstance];
    _profile.profileID = user.id;
    data.user.fbId = user.id;
    data.user.name = [user objectForKey:@"name"];
    //self.partyButton.enabled = YES;
    
    [_profile layoutSubviews];
}
@end
