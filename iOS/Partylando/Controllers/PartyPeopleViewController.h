//
//  PartyPeopleViewController.h
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <FacebookSDK/FacebookSDK.h>

@interface PartyPeopleViewController : UIViewController<UICollectionViewDelegate,UICollectionViewDataSource>{
    
    IBOutlet UICollectionView *partyPeopleCollection;
}
@property (strong, nonatomic) UICollectionView *partyPeopleCollection;
@property (strong, nonatomic) IBOutlet FBProfilePictureView *userView;
@property (strong, nonatomic) IBOutlet UILabel *nameLabel;
@property (strong, nonatomic) IBOutlet UILabel *partyLabel;
@property (strong, nonatomic) IBOutlet UILabel *dressCodeLabel;

@end
