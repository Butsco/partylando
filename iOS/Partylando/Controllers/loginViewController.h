//
//  loginViewController.h
//  Partylando
//
//  Created by Roberto Dries on 27/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <FacebookSDK/FacebookSDK.h>

@interface loginViewController : UIViewController<FBLoginViewDelegate>

@property (strong, nonatomic) IBOutlet FBLoginView *FBLoginView;
@property (strong, nonatomic) IBOutlet FBProfilePictureView *ProfilePic;
@property (strong, nonatomic) IBOutlet UIButton *partyButton;

@end
