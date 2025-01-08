import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MaterialsModule } from '../../material/material.module'\
import { MaterialModule } from '@regio-ki/material';
import { environment } from '@env/environment';
import { UtilityService } from '@regio-ki/regioki-core';

@Component({
  selector: 'lib-app-card',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './ai-app-card.component.html',
  styleUrl: './ai-app-card.component.scss',
})
export class AiAppCardComponent implements OnInit {
  @Input() cardDetails: any = {};
  @Input() showMenuOptions = true;
  @Output() updatedClickedEvent = new EventEmitter();
  @Output() viewClickedEvent = new EventEmitter();
  @Output() deleteClickedEvent = new EventEmitter();

  constructor(private _utilService: UtilityService) {}
  isDropdownOpen = false;
  username: string | null = '';
  role: string | null = '';
  loggedInUser: any;
  logoUrl: string | null = '';
  isCustomer = false;
  emitEvent(id: any, event: any) {
    event.emit(id);
  }
  get appIconUrl(): string | null {
    return this.cardDetails?.icons?.data?.attributes?.url
      ? `${environment.serverImageUrl}${this.cardDetails?.icons.data.attributes.url}`
      : null;
  }
  ngOnInit(): void {
    const userDetails = this._utilService.getCurrentUser();
    if (userDetails) {
      const user = userDetails;
      this.loggedInUser = user;
      if (this.loggedInUser?.company_user) {
        this.isCustomer = true;
      }
    }
  }
  openMenu(event: MouseEvent): void {
    event.stopPropagation(); // Prevent the card's click event from firing
  }
}
