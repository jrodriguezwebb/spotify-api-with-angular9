import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs/internal/observable/of';
import { searchMock } from '../../test-utils/search.mock';
import { mockArtistInfo } from '../../test-utils/test-utils';
import { SpotifyService } from '../services/spotify.service';

import { SearchBoxComponent } from './search-box.component';

describe('SearchBoxComponent', () => {
  let component: SearchBoxComponent;
  let fixture: ComponentFixture<SearchBoxComponent>;
  let formBuilder: FormBuilder;
  let spotifyService: SpotifyService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientModule,
        ReactiveFormsModule,
      ],
      declarations: [ SearchBoxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBoxComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    spotifyService = TestBed.inject(SpotifyService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('closeList', () => {
    it('should open the searchbox', () => {
      const q = 'needle';
      spyOn(component, 'getResults');
      component.closeList(q);
      expect(component.getResults).toHaveBeenCalledWith(q);
    });
    it('should close the searchbox', () => {
      component.showListFlag = true;
      component.closeList('1');
      expect(component.showListFlag ).toBeFalsy();
    });
  });

  describe('getResults', () => {
    it('should should do search function if there is a needle', () => {
      const type = component.form.get('type').value;
      const q = 'needle';
      const params = {
        q,
        type: 'artist,track,album',
      };
      spyOn(spotifyService, 'search').and.returnValue(of({}) as any);
      component.getResults(q);
      expect(spotifyService.search).toHaveBeenCalledWith(params, type);
    });

    it('should should do search function if there is a needle', () => {
      component.getResults(undefined);
      expect(component.results).toBeNull();
      expect(component.showListFlag).toBeFalse();
    });
  });

  describe('selectItem', () => {
    it('should should select the Item', () => {
      component.results = {
        results: searchMock,
        tracks: [],
        albums: [],
        artists: [],
      };
      component.selectItem(mockArtistInfo);
      expect(component.itemSelected).toEqual(mockArtistInfo);
      expect(component.results).toBeNull();
      expect(component.showListFlag).toBeFalse();
    });
  });
});
