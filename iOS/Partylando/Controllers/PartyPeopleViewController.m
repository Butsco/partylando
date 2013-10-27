//
//  PartyPeopleViewController.m
//  Partylando
//
//  Created by Roberto Dries on 26/10/13.
//  Copyright (c) 2013 Youbba. All rights reserved.
//

#import "PartyPeopleViewController.h"
#import "UserProfile.h"

@interface PartyPeopleViewController ()

@end

@implementation PartyPeopleViewController{
    PartyData *partyData;
    NSMutableArray *users;
}

@synthesize partyPeopleCollection=_partyPeopleCollection;


- (void)viewDidLoad
{
    [super viewDidLoad];
    [self loadPartyData];
    _partyPeopleCollection.delegate = self;
    _partyPeopleCollection.dataSource = self;
    _partyPeopleCollection.allowsMultipleSelection = YES;
    self.userView.profileID = partyData.user.fbId;
    users = [[NSMutableArray alloc]init];
    //_partyPeopleCollection.backgroundView = [[UIImageView alloc]initWithImage:[UIImage imageNamed:@"background"]];
}

- (UICollectionViewCell*)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath{
    UserProfile *user = [partyData.room.participants objectAtIndex:indexPath.row];
    UICollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:@"cell" forIndexPath:indexPath];
    
    
    UIImageView *userImage = (UIImageView*) [cell viewWithTag:1];
    userImage.layer.cornerRadius = 35;
    userImage.layer.borderWidth = 1;
    if([users containsObject:user])
        userImage.layer.borderWidth = 3;
    userImage.layer.borderColor =[UIColor blackColor].CGColor;
    [userImage setImage:user.image];
    UILabel *userLabel = (UILabel*) [cell viewWithTag:2];
    [userLabel setText:user.name];
    
    return cell;
}
- (void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    
    UserProfile *user = [[PartyData sharedInstance].room.participants objectAtIndex:indexPath.row];
    if([users containsObject:user]){
        [users removeObject:user];
    }else{
        if(users.count>=2)
            return;
        [users addObject:user];
    }
    [_partyPeopleCollection reloadData];
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section{
    return partyData.room.participants.count;
}

- (void)loadPartyData{
    partyData = [PartyData sharedInstance];
    
    [self.partyLabel setText:partyData.room.name ];
    [self.dressCodeLabel setText: partyData.room.dressCode];
    
    [self.nameLabel setText:partyData.user.name];
    [self.userView setProfileID:partyData.user.fbId];
    //[self.userView setImage:partyData.user.image];
    
    [self.userView layoutSubviews];
    
}
@end
